import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import cashier from './routes/cashier.js';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/cashier', cashier);

// 疎通確認用
app.get('/health', (c) => c.json({ status: 'ok' }));

serve({
  fetch: app.fetch,
  port: 3000,
});
