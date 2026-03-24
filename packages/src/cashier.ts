// GET /sessions/:sessionId/products のレスポンス
export type GetSessionProductsResponse = {
  session_id: string;
  products: SessionProduct[];
};

import type { SessionProduct } from './product.js';
export type { SessionProduct };
