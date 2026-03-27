import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

const auth = new Hono();

// POST /auth/join
// トークンを検証してcircle_membersに登録する
auth.post('/join', async (c) => {
  const { token } = await c.req.json<{ token: string }>();

  if (!token) {
    return c.json({ error: 'トークンが必要です' }, 400);
  }

  // JWTからログイン中のユーザーを取得
  const authHeader = c.req.header('Authorization');
  const jwt = authHeader?.replace('Bearer ', '');

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return c.json({ error: '認証が必要です' }, 401);
  }

  // トークンを検証
  const { data: inviteToken, error: tokenError } = await supabase
    .from('invite_tokens')
    .select('id, circle_id, role')
    .eq('token', token)
    .single();

  if (tokenError || !inviteToken) {
    return c.json({ error: '無効なトークンです' }, 400);
  }

  // すでに所属しているか確認
  const { data: existing } = await supabase
    .from('circle_members')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('circle_id', inviteToken.circle_id)
    .single();

  if (existing) {
    return c.json({ error: 'すでにサークルに所属しています' }, 400);
  }

  // circle_membersに登録
  const { error: joinError } = await supabase.from('circle_members').insert({
    user_id: user.id,
    circle_id: inviteToken.circle_id,
    role: inviteToken.role,
  });

  if (joinError) {
    console.error('joinError:', joinError);
    return c.json({ error: 'サークルへの参加に失敗しました' }, 500);
  }

  return c.json(
    { message: 'サークルに参加しました', role: inviteToken.role },
    200,
  );
});

// GET /auth/me
// ログイン中のユーザー情報とサークル所属を返す
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  const jwt = authHeader?.replace('Bearer ', '');

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return c.json({ error: '認証が必要です' }, 401);
  }

  // プロフィールとサークル所属を取得
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      `
      id,
      name,
      is_app_admin,
      circle_members (
        role,
        circles (
          id,
          name
        )
      )
    `,
    )
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return c.json({ error: 'プロフィールが見つかりません' }, 404);
  }

  return c.json(profile, 200);
});

export default auth;
