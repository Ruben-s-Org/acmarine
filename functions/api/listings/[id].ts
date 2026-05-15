import { verifySession } from '../../_lib/session';

interface Env { LISTINGS: KVNamespace; SESSION_SECRET: string; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = String(params.id);
  const raw = await env.LISTINGS.get(`listing:${id}`);
  if (!raw) return json({ error: 'not found' }, 404);
  return json({ listing: JSON.parse(raw) });
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env, request }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const id = String(params.id);
  const raw = await env.LISTINGS.get(`listing:${id}`);
  if (!raw) return json({ error: 'not found' }, 404);
  const obj = JSON.parse(raw);
  await env.LISTINGS.delete(`listing:${id}`);
  if (obj.slug) await env.LISTINGS.delete(`slug:${obj.slug}`);
  return json({ ok: true });
};
