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

  // ordersに1行insert
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      session_id: body.session_id,
      user_id: 'c82cc910-583b-4814-a17f-9e946178aef3',
      total_price: body.total_price,
      sold_at: new Date().toISOString(),
    })
    .select('id, total_price, created_at')
    .single();

  if (orderError) {
    console.error('orderError:', orderError);
    return c.json({ error: '注文の保存に失敗しました' }, 500);
  }

  // order_itemsに商品の数だけinsert
  const { error: itemsError } = await supabase.from('order_items').insert(
    body.items.map((item) => ({
      order_id: order.id,
      session_product_id: item.session_product_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
    })),
  );

  if (itemsError) {
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
