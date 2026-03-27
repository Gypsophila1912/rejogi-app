## APIについてまとめときます

cashier/sessions/セッションのID/products
レジ画面の商品一覧取得API

```
const res = await fetch('http://localhost:3000/cashier/sessions/session-1/products');
const data: GetSessionProductsResponse = await res.json();
```

/cashier/orders
会計完了ボタン押したときのAPI

```
const res = await fetch('http://localhost:3000/cashier/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
const data: CreateOrderResponse = await res.json();
```
