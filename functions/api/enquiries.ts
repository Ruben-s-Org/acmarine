import { verifySession } from '../_lib/session';
import { listEnquiries } from '../_lib/store';

interface Env { IMAGES: R2Bucket; SESSION_SECRET: string; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const enquiries = await listEnquiries(env.IMAGES);
  return json({ enquiries });
};
