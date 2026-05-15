import { verifySession } from '../../_lib/session';
import { readListings, writeListings, slugify, Listing } from '../../_lib/store';

interface Env {
  IMAGES: R2Bucket;
  SESSION_SECRET: string;
}

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get('drafts') === '1'
    && await verifySession(request, env.SESSION_SECRET);
  const all = await readListings(env.IMAGES);
  const items = Object.values(all).filter(l => includeDrafts || l.status !== 'draft');
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

    const all = await readListings(env.IMAGES);
    const now = new Date().toISOString();
    const id = body.id || crypto.randomUUID();

    const baseSlug = slugify(body.slug || body.name);
    let slug = baseSlug;
    if (!body.id) {
      const takenSlugs = new Set(Object.values(all).map(v => v.slug));
      let n = 2;
      while (takenSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
    }

    const existingObj: Partial<Listing> = body.id ? (all[id] || {}) : {};

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

    all[id] = listing;
    await writeListings(env.IMAGES, all);
    return json({ ok: true, listing });
  } catch (err) {
    return json({ error: 'server error', detail: (err as Error)?.message || String(err) }, 500);
  }
};
