import { createMiddleware } from 'hono/factory';
import { supabase } from '../lib/supabase.js';

export const appAdminMiddleware = createMiddleware(async (c, next) => {
  const userId = c.get('userId');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_app_admin')
    .eq('id', userId)
    .single();

  if (!profile?.is_app_admin) {
    return c.json({ error: '管理者権限が必要です' }, 403);
  }

  await next();
});
