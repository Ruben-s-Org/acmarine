interface Env { LISTINGS: KVNamespace; }

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as any;
  if (!body) return json({ error: 'invalid' }, 400);
  const { name, email, message, listing_slug } = body || {};
  if (!name || !email || !message) return json({ error: 'missing fields' }, 400);
  const record = {
    id: crypto.randomUUID(),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    message: String(message).slice(0, 4000),
    listing_slug: listing_slug ? String(listing_slug).slice(0, 200) : null,
    created_at: new Date().toISOString(),
  };
  await env.LISTINGS.put(`enquiry:${record.created_at}-${record.id}`, JSON.stringify(record), {
    expirationTtl: 60 * 60 * 24 * 365,
  });
  return json({ ok: true });
};
