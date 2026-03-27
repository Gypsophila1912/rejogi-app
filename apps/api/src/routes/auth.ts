import { Hono } from 'hono';
import { supabase } from '../lib/supabase.js';

type Variables = {
  userId: string;
};

const auth = new Hono<{ Variables: Variables }>();

// POST /auth/join
// トークンを検証してcircle_membersに登録する
auth.post('/join', async (c) => {
  const { token } = await c.req.json<{ token: string }>();
  const userId = c.get('userId');

  if (!token) {
    return c.json({ error: 'トークンが必要です' }, 400);
  }

  const { data: inviteToken, error: tokenError } = await supabase
    .from('invite_tokens')
    .select('id, circle_id, role')
    .eq('token', token)
    .single();

  if (tokenError || !inviteToken) {
    console.error('tokenError:', tokenError, 'token:', token); // 追加
    return c.json({ error: '無効なトークンです' }, 400);
  }
  // すでに所属しているか確認
  const { data: existing } = await supabase
    .from('circle_members')
    .select('user_id')
    .eq('user_id', userId)
    .eq('circle_id', inviteToken.circle_id)
    .single();

  if (existing) {
    return c.json({ error: 'すでにサークルに所属しています' }, 400);
  }

  // circle_membersに登録
  const { error: joinError } = await supabase.from('circle_members').insert({
    user_id: userId,
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
  const userId = c.get('userId');
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
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return c.json({ error: 'プロフィールが見つかりません' }, 404);
  }

  return c.json(profile, 200);
});

// POST /auth/invite
// トークン付き招待URLを発行する（app_adminのみ）
auth.post('/invite', async (c) => {
  const userId = c.get('userId');

  // app_adminか確認
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_app_admin')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return c.json({ error: 'プロフィールが見つかりません' }, 404);
  }

  if (!profile.is_app_admin) {
    return c.json({ error: '権限がありません' }, 403);
  }

  const { circle_id, role } = await c.req.json<{
    circle_id: string;
    role: 'circle_admin' | 'general';
  }>();

  if (!circle_id || !role) {
    return c.json({ error: 'circle_idとroleが必要です' }, 400);
  }

  // トークン生成
  const token = crypto.randomUUID();

  const { error: insertError } = await supabase
    .from('invite_tokens')
    .insert({ circle_id, token, role });

  if (insertError) {
    console.error('insertError:', insertError);
    return c.json({ error: 'トークンの発行に失敗しました' }, 500);
  }

  const inviteUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;

  return c.json({ invite_url: inviteUrl, token, role }, 201);
});

// PATCH /auth/profile
// ニックネームを更新する
auth.patch('/profile', async (c) => {
  const userId = c.get('userId');
  const { name } = await c.req.json<{ name: string }>();

  if (!name || name.trim() === '') {
    return c.json({ error: 'ニックネームを入力してください' }, 400);
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name: name.trim(), updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('profileUpdateError:', error);
    return c.json({ error: 'ニックネームの保存に失敗しました' }, 500);
  }

  return c.json({ message: 'ニックネームを保存しました' }, 200);
});

export default auth;
