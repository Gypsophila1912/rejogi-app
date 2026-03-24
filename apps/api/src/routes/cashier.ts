import { Hono } from 'hono';

import type {
  GetSessionProductsResponse,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@rejogi/types';

const cashier = new Hono();

// GET /cashier/sessions/:sessionId/products
// フロントがレジ画面を開いたとき商品一覧を取得する

cashier.get('/sessions/:sessionId/products', (c) => {
  const { sessionId } = c.req.param();

  const mock: GetSessionProductsResponse = {
    session_id: sessionId,
    products: [
      {
        id: 'sp-1',
        product_id: 'p-1',
        name: 'たこ焼き',
        price: 500,
        active: true,
      },
      {
        id: 'sp-2',
        product_id: 'p-2',
        name: 'フランクフルト',
        price: 300,
        active: true,
      },
      {
        id: 'sp-3',
        product_id: 'p-3',
        name: 'ジュース',
        price: 200,
        active: true,
      },
    ],
  };

  return c.json(mock);
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
