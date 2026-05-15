interface Env { IMAGES: R2Bucket; }

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const raw = params.path;
  const path = Array.isArray(raw) ? raw.join('/') : String(raw || '');
  if (!path) return new Response('not found', { status: 404 });
  const obj = await env.IMAGES.get(path);
  if (!obj) return new Response('not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(obj.body, { headers });
};
