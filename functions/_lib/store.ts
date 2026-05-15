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

const LISTINGS_KEY = '_meta/listings.json';

export async function readListings(bucket: R2Bucket): Promise<Record<string, Listing>> {
  const obj = await bucket.get(LISTINGS_KEY);
  if (!obj) return {};
  try {
    const text = await obj.text();
    return JSON.parse(text) as Record<string, Listing>;
  } catch {
    return {};
  }
}

export async function writeListings(bucket: R2Bucket, data: Record<string, Listing>): Promise<void> {
  await bucket.put(LISTINGS_KEY, JSON.stringify(data), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' },
  });
}

export async function listSlug(bucket: R2Bucket, slug: string): Promise<Listing | null> {
  const all = await readListings(bucket);
  for (const v of Object.values(all)) {
    if (v.slug === slug) return v;
  }
  return null;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  listing_slug: string | null;
  created_at: string;
}

export async function appendEnquiry(bucket: R2Bucket, e: Enquiry): Promise<void> {
  const key = `_meta/enquiries/${e.created_at}-${e.id}.json`;
  await bucket.put(key, JSON.stringify(e), {
    httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' },
  });
}

export async function listEnquiries(bucket: R2Bucket, limit = 200): Promise<Enquiry[]> {
  const list = await bucket.list({ prefix: '_meta/enquiries/', limit });
  const items: Enquiry[] = [];
  for (const o of list.objects) {
    const obj = await bucket.get(o.key);
    if (!obj) continue;
    try { items.push(JSON.parse(await obj.text())); } catch {}
  }
  items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return items;
}

export function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
