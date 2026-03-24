// カートの1行
export type CartItem = {
  session_product_id: string;
  name: string;
  price: number;
  quantity: number;
};

// 会計確定時にAPIへ送るリクエスト
export type CreateOrderRequest = {
  session_id: string;
  items: {
    session_product_id: string;
    quantity: number;
    price_at_time: number;
  }[];
  total_price: number;
};

// APIからのレスポンス
export type CreateOrderResponse = {
  order_id: string;
  total_price: number;
  created_at: string;
};
