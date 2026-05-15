import { verifySession } from '../../_lib/session';

interface Env { SESSION_SECRET: string; }

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const ok = await verifySession(request, env.SESSION_SECRET);
  return new Response(JSON.stringify({ authenticated: ok }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
