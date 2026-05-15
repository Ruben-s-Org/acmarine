import { verifySession } from '../_lib/session';

interface Env { IMAGES: R2Bucket; SESSION_SECRET: string; }

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_BYTES = 8 * 1024 * 1024;

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await verifySession(request, env.SESSION_SECRET))) return json({ error: 'unauthorized' }, 401);
  const ct = request.headers.get('Content-Type') || '';
  if (!ct.startsWith('multipart/form-data')) return json({ error: 'expected multipart' }, 400);
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ error: 'no file' }, 400);
  if (!ALLOWED.has(file.type)) return json({ error: 'unsupported type' }, 415);
  if (file.size > MAX_BYTES) return json({ error: 'too large' }, 413);

  const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const key = `yachts/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const buf = await file.arrayBuffer();
  await env.IMAGES.put(key, buf, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
  });
  return json({ ok: true, url: `/api/images/${key}`, key });
};
