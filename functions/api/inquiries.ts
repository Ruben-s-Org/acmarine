import { verifySession } from '../_lib/session';
import { listInquiries } from '../_lib/store';

interface Env { IMAGES: R2Bucket; SESSION_SECRET: string; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const inquiries = await listInquiries(env.IMAGES);
  return json({ inquiries });
};
