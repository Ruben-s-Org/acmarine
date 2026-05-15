import { listArticles } from '../_lib/store';
import { pageShell, esc } from '../_lib/page';

interface Env { IMAGES: R2Bucket; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const articles = await listArticles(env.IMAGES);
  const canonical = 'https://acmarine.com/articles';
  const title = 'Articles. Aldridge & Charles Marine.';
  const description = 'Articles from the office: yacht industry analysis, refit notes, brokerage context, crew and charter insight. Published when there is something worth saying.';

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: canonical },
    ],
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Articles',
    url: canonical,
    description,
    isPartOf: { '@type': 'WebSite', name: 'Aldridge & Charles Marine', url: 'https://acmarine.com/' },
    hasPart: articles.slice(0, 20).map(a => ({
      '@type': 'NewsArticle', headline: a.title, url: `https://acmarine.com/articles/${a.slug}`,
      datePublished: a.published_at, image: a.image_url || undefined,
    })),
  };

  const list = articles.length > 0
    ? articles.map(a => `
      <a class="yacht-card" href="/articles/${esc(a.slug)}">
        <div class="card-image">
          ${a.image_url
            ? `<img src="${esc(a.image_url)}" alt="${esc(a.title)}" loading="lazy">`
            : '<div class="card-image-empty" aria-hidden="true"><svg viewBox="0 0 80 80" width="48" height="48"><circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="1"/></svg></div>'}
        </div>
        <div class="card-body">
          <p class="card-meta">${esc(a.category || 'Article')} &middot; ${esc((a.published_at || a.created_at).slice(0, 10))}</p>
          <h3 class="card-name">${esc(a.title)}</h3>
          <p class="card-spec">${esc((a.description || '').slice(0, 140))}</p>
        </div>
      </a>
    `).join('')
    : `<p class="fleet-empty">The office publishes when there is something worth saying. The first articles appear shortly.</p>`;

  const body = `
<main class="fleet-page">
<section class="fleet-hero">
  <div class="fleet-hero-inner">
    <p class="eyebrow">Articles</p>
    <h1>Notes from the office.</h1>
    <p class="fleet-lede">Yacht industry analysis, refit notes, brokerage context, crew and charter insight. Published when there is something worth saying.</p>
  </div>
</section>
<section class="fleet-list-section">
  <div class="fleet-grid">
    ${list}
  </div>
</section>
</main>`;

  return new Response(pageShell({
    title,
    description: description.slice(0, 158),
    canonical,
    jsonLd: [collectionLd, breadcrumbLd],
    body,
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=120, s-maxage=300',
    },
  });
};
