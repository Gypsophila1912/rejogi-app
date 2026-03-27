import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

type Variables = {
  userId: string;
};

const appAdmin = new Hono<{ Variables: Variables }>();

// GET /app-admin/circles
// サークル一覧取得
appAdmin.get('/circles', async (c) => {
  const { data, error } = await supabase
    .from('circles')
    .select(
      `
      id,
      name,
      created_at,
      invite_tokens (
        id,
        token,
        role,
        created_at
      ),
      circle_members (
        user_id,
        role,
        joined_at,
        profiles (
          id,
          name
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('circles fetch error:', error);
    return c.json({ error: 'サークル一覧の取得に失敗しました' }, 500);
  }

  return c.json(data, 200);
});

// POST /app-admin/circles
// サークル追加
appAdmin.post('/circles', async (c) => {
  const { name } = await c.req.json<{ name: string }>();

  if (!name || name.trim() === '') {
    return c.json({ error: 'サークル名を入力してください' }, 400);
  }

  // サークル作成
  const { data: circle, error: circleError } = await supabase
    .from('circles')
    .insert({ name: name.trim() })
    .select('id, name, created_at')
    .single();

  if (circleError) {
    console.error('circle insert error:', circleError);
    return c.json({ error: 'サークルの追加に失敗しました' }, 500);
  }

  // 管理者用と一般用のトークンを自動発行
  const adminToken = crypto.randomUUID();
  const generalToken = crypto.randomUUID();

  const { error: tokenError } = await supabase.from('invite_tokens').insert([
    { circle_id: circle.id, token: adminToken, role: 'circle_admin' },
    { circle_id: circle.id, token: generalToken, role: 'general' },
  ]);

  if (tokenError) {
    console.error('token insert error:', tokenError);
    return c.json({ error: 'トークンの発行に失敗しました' }, 500);
  }

  const baseUrl = process.env.FRONTEND_URL;

  return c.json(
    {
      ...circle,
      invite_urls: {
        admin: `${baseUrl}/invite?token=${adminToken}`,
        general: `${baseUrl}/invite?token=${generalToken}`,
      },
    },
    201,
  );
});

// GET /app-admin/circles/:circleId
// サークル詳細取得
appAdmin.get('/circles/:circleId', async (c) => {
  const { circleId } = c.req.param();

  const { data, error } = await supabase
    .from('circles')
    .select(
      `
      id,
      name,
      created_at,
      invite_tokens (
        id,
        token,
        role,
        created_at
      ),
      circle_members (
        user_id,
        role,
        joined_at,
        profiles (
          id,
          name
        )
      )
    `,
    )
    .eq('id', circleId)
    .single();

  if (error) {
    console.error('circle fetch error:', error);
    return c.json({ error: 'サークルの取得に失敗しました' }, 500);
  }

  return c.json(data, 200);
});

// GET /app-admin/members
// 全ユーザー一覧取得
appAdmin.get('/members', async (c) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      name,
      is_app_admin,
      created_at,
      circle_members (
        role,
        joined_at,
        circles (
          id,
          name
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('members fetch error:', error);
    return c.json({ error: 'メンバー一覧の取得に失敗しました' }, 500);
  }

  return c.json(data, 200);
});

export default appAdmin;
