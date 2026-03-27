import { createMiddleware } from 'hono/factory';
import { supabase } from '../lib/supabase.js';

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const jwt = authHeader?.replace('Bearer ', '');

  if (!jwt) {
    return c.json({ error: '認証が必要です' }, 401);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) {
    return c.json({ error: '認証が必要です' }, 401);
  }

  // 後続のルートでuser.idを使えるようにする
  c.set('userId', user.id);

  await next();
});
