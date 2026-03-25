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

  // バリデーション（最低限）
  if (!body.items || body.items.length === 0) {
    return c.json({ error: 'カートが空です' }, 400);
  }

  const mock: CreateOrderResponse = {
    order_id: crypto.randomUUID(),
    total_price: body.total_price,
    created_at: new Date().toISOString(),
  };

  return c.json(mock, 201);
});

export default cashier;
