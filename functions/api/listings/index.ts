import { verifySession } from '../../_lib/session';

interface Env {
  LISTINGS: KVNamespace;
  SESSION_SECRET: string;
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  builder?: string;
  year?: number;
  loa_m?: number;
  beam_m?: number;
  price?: string;
  location?: string;
  short?: string;
  description?: string;
  hero_image?: string;
  gallery?: string[];
  specs?: Record<string, string>;
  status?: 'available' | 'sale-pending' | 'sold' | 'draft';
  created_at: string;
  updated_at: string;
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function json(data: any, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get('drafts') === '1'
    && await verifySession(request, env.SESSION_SECRET);

  const list = await env.LISTINGS.list({ prefix: 'listing:' });
  const items: Listing[] = [];
  for (const key of list.keys) {
    const raw = await env.LISTINGS.get(key.name);
    if (!raw) continue;
    try {
      const v = JSON.parse(raw) as Listing;
      if (!includeDrafts && v.status === 'draft') continue;
      items.push(v);
    } catch {}
  }
  items.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
  return json({ listings: items });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
  if (!(await verifySession(request, env.SESSION_SECRET))) {
    return json({ error: 'unauthorized' }, 401);
  }
  const body = await request.json().catch(() => null) as Partial<Listing> | null;
  if (!body || !body.name) return json({ error: 'name required' }, 400);

  const now = new Date().toISOString();
  const id = body.id || crypto.randomUUID();
  const baseSlug = slugify(body.slug || body.name);

  let slug = baseSlug;
  if (!body.id) {
    let n = 2;
    while (await env.LISTINGS.get(`slug:${slug}`)) {
      slug = `${baseSlug}-${n++}`;
    }
  } else {
    slug = baseSlug;
  }

  const existing = body.id ? await env.LISTINGS.get(`listing:${id}`) : null;
  const existingObj: Partial<Listing> = existing ? JSON.parse(existing) : {};

  const listing: Listing = {
    id,
    slug,
    name: String(body.name),
    builder: body.builder?.toString() || existingObj.builder,
    year: typeof body.year === 'number' ? body.year : existingObj.year,
    loa_m: typeof body.loa_m === 'number' ? body.loa_m : existingObj.loa_m,
    beam_m: typeof body.beam_m === 'number' ? body.beam_m : existingObj.beam_m,
    price: body.price?.toString() || existingObj.price,
    location: body.location?.toString() || existingObj.location,
    short: body.short?.toString() || existingObj.short,
    description: body.description?.toString() || existingObj.description,
    hero_image: body.hero_image?.toString() || existingObj.hero_image,
    gallery: Array.isArray(body.gallery) ? body.gallery : existingObj.gallery,
    specs: typeof body.specs === 'object' && body.specs ? body.specs as any : existingObj.specs,
    status: (body.status as any) || existingObj.status || 'available',
    created_at: existingObj.created_at || now,
    updated_at: now,
  };

  if (existingObj.slug && existingObj.slug !== slug) {
    await env.LISTINGS.delete(`slug:${existingObj.slug}`);
  }
  await env.LISTINGS.put(`listing:${id}`, JSON.stringify(listing));
  await env.LISTINGS.put(`slug:${slug}`, id);
  return json({ ok: true, listing });
  } catch (err) {
    return json({ error: 'server error', detail: (err as Error)?.message || String(err), stack: (err as any)?.stack?.split('\n').slice(0, 5) }, 500);
  }
};
