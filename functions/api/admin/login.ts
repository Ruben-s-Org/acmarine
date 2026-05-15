import { makeSessionToken, sessionCookieHeader, clearCookieHeader } from '../../_lib/session';

interface Env {
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let password = '';
  const ct = request.headers.get('Content-Type') || '';
  if (ct.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    password = (body as any)?.password || '';
  } else {
    const form = await request.formData().catch(() => null);
    password = String(form?.get('password') || '');
  }
  if (password !== env.ADMIN_PASSWORD) {
    await new Promise(r => setTimeout(r, 500));
    return new Response(JSON.stringify({ error: 'invalid' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }
  const token = await makeSessionToken(env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': sessionCookieHeader(token),
    },
  });
};

export const onRequestDelete: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearCookieHeader() },
  });
};
