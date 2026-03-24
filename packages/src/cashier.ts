// GET /sessions/:sessionId/products のレスポンス
import type { SessionProduct } from './product.js';

export type GetSessionProductsResponse = {
  session_id: string;
  products: SessionProduct[];
};
export type { SessionProduct };
