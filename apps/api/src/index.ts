import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import cashier from './routes/cashier.js';
import auth from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';

type Variables = {
  userId: string;
};

const app = new Hono<{ Variables: Variables }>();

app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use('/auth/*', authMiddleware);
app.use('/cashier/*', authMiddleware);

app.route('/cashier', cashier);

app.route('/auth', auth);

// 疎通確認用
app.get('/health', (c) => c.json({ status: 'ok' }));

serve({
  fetch: app.fetch,
  port: 3000,
});
