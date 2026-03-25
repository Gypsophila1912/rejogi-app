import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

import type {
  GetSessionProductsResponse,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@rejogi/types';

const cashier = new Hono();

// GET /cashier/sessions/:sessionId/products
// フロントがレジ画面を開いたとき商品一覧を取得する
cashier.get('/sessions/:sessionId/products', async (c) => {
  const { sessionId } = c.req.param();

  const { data, error } = await supabase
    .from('session_products')
    .select('id, name, price, active')
    .eq('session_id', sessionId)
    .eq('active', true)
    .order('created_at', { ascending: true });

  if (error) {
    return c.json({ error: 'データの取得に失敗しました' }, 500);
  }

  const response: GetSessionProductsResponse = {
    session_id: sessionId,
    products: data.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      active: p.active,
    })),
  };

  return c.json(response);
});

// POST /cashier/orders
// カートの中身を確定して注文を保存する
cashier.post('/orders', async (c) => {
  const body = await c.req.json<CreateOrderRequest>();

  if (!body.items || body.items.length === 0) {
    return c.json({ error: 'カートが空です' }, 400);
  }

  // session_productsからサーバー側で価格を引き直す
  const productIds = body.items.map((item) => item.session_product_id);

  const { data: products, error: productsError } = await supabase
    .from('session_products')
    .select('id, price, active')
    .eq('session_id', body.session_id)
    .in('id', productIds);

  if (productsError || !products) {
    return c.json({ error: '商品情報の取得に失敗しました' }, 500);
  }

  // 存在しない・別セッションの商品・販売停止の商品が含まれていないか確認
  for (const item of body.items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return c.json(
        { error: `数量が不正です: ${item.session_product_id}` },
        400,
      );
    }
    const product = products.find((p) => p.id === item.session_product_id);
    if (!product) {
      return c.json(
        { error: `商品が見つかりません: ${item.session_product_id}` },
        400,
      );
    }
    if (!product.active) {
      return c.json(
        {
          error: `販売停止中の商品が含まれています: ${item.session_product_id}`,
        },
        400,
      );
    }
  }

  // サーバー側で合計金額を再計算
  const serverTotal = body.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.session_product_id)!;
    return sum + product.price * item.quantity;
  }, 0);

  // ordersに1行insert
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      session_id: body.session_id,
      user_id: 'c82cc910-583b-4814-a17f-9e946178aef3',
      total_price: serverTotal, // フロントの値ではなくサーバー計算値を使う
      sold_at: new Date().toISOString(),
    })
    .select('id, total_price, created_at')
    .single();

  if (orderError) {
    console.error('orderError:', orderError);
    return c.json({ error: '注文の保存に失敗しました' }, 500);
  }

  // order_itemsに商品の数だけinsert（price_at_timeもサーバー側の価格を使う）
  const { error: itemsError } = await supabase.from('order_items').insert(
    body.items.map((item) => {
      const product = products.find((p) => p.id === item.session_product_id)!;
      return {
        order_id: order.id,
        session_product_id: item.session_product_id,
        quantity: item.quantity,
        price_at_time: product.price, // フロントの値ではなくDBの価格を使う
      };
    }),
  );

  if (itemsError) {
    console.error('itemsError:', itemsError);
    return c.json({ error: '注文明細の保存に失敗しました' }, 500);
  }

  const response: CreateOrderResponse = {
    order_id: order.id,
    total_price: order.total_price,
    created_at: order.created_at,
  };

  return c.json(response, 201);
});
export default cashier;
