import { readListings } from './_lib/store';

interface Env { IMAGES: R2Bucket; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const urls: { loc: string; lastmod?: string; priority?: string }[] = [
    { loc: 'https://acmarine.com/', priority: '1.0' },
    { loc: 'https://acmarine.com/fleet', priority: '0.9' },
  ];
  const all = await readListings(env.IMAGES);
  for (const v of Object.values(all)) {
    if (v.status === 'draft') continue;
    urls.push({
      loc: `https://acmarine.com/yacht/${encodeURIComponent(v.slug)}`,
      lastmod: (v.updated_at || v.created_at || '').slice(0, 10) || undefined,
      priority: '0.8',
    });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority || '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
