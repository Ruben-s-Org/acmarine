import { verifySession } from '../../_lib/session';
import { readListings, writeListings } from '../../_lib/store';

interface Env { IMAGES: R2Bucket; SESSION_SECRET: string; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = String(params.id);
  const all = await readListings(env.IMAGES);
  if (!all[id]) return json({ error: 'not found' }, 404);
  return json({ listing: all[id] });
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env, request }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const id = String(params.id);
  const all = await readListings(env.IMAGES);
  if (!all[id]) return json({ error: 'not found' }, 404);
  delete all[id];
  await writeListings(env.IMAGES, all);
  return json({ ok: true });
};
