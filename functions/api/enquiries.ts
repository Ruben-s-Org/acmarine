import { verifySession } from '../_lib/session';

interface Env { LISTINGS: KVNamespace; SESSION_SECRET: string; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const list = await env.LISTINGS.list({ prefix: 'enquiry:', limit: 200 });
  const items: any[] = [];
  for (const key of list.keys) {
    const raw = await env.LISTINGS.get(key.name);
    if (raw) {
      try { items.push(JSON.parse(raw)); } catch {}
    }
  }
  items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return json({ enquiries: items });
};
