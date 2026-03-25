export type Product = {
  id: string;
  circle_id: string;
  name: string;
  price: number;
  active: boolean;
};

// レジ画面用（セッションに紐づいた商品）
export type SessionProduct = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};
