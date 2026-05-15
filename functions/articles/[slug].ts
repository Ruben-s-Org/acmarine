import { getArticle } from '../_lib/store';
import { pageShell, esc } from '../_lib/page';

interface Env { IMAGES: R2Bucket; }

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const slug = String(params.slug || '').toLowerCase();
  const a = await getArticle(env.IMAGES, slug);
  if (!a) return new Response('not found', { status: 404 });

  const canonical = `https://acmarine.com/articles/${a.slug}`;
  const title = `${a.title}. Aldridge & Charles Marine.`;
  const description = a.description || a.title;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.seo_title || a.title,
    description: a.description,
    datePublished: a.published_at,
    dateModified: a.created_at,
    image: a.image_url ? [a.image_url] : undefined,
    author: { '@type': 'Organization', name: 'Aldridge & Charles Marine' },
    publisher: { '@type': 'Organization', name: 'Aldridge & Charles Marine', url: 'https://acmarine.com/' },
    mainEntityOfPage: canonical,
    articleSection: a.category,
    keywords: (a.keywords || []).join(', '),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://acmarine.com/articles' },
      { '@type': 'ListItem', position: 3, name: a.title, item: canonical },
    ],
  };

  const body = `
<main class="article-page">

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/articles">Articles</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span>${esc(a.title)}</span>
</nav>

<article>
  <header class="article-header">
    <p class="eyebrow">${esc(a.category || 'Article')} &middot; ${esc((a.published_at || '').slice(0, 10))}</p>
    <h1>${esc(a.title)}</h1>
    <p class="article-lede">${esc(a.description || '')}</p>
  </header>

  ${a.image_url ? `<figure class="article-hero"><img src="${esc(a.image_url)}" alt="${esc(a.title)}" width="1200" height="800"></figure>` : ''}

  <div class="article-content">
    ${a.content}
  </div>
</article>

<section class="contact" id="contact">
  <div class="contact-inner">
    <p class="eyebrow">Enquire</p>
    <h2>Write to the office.</h2>
    <p class="contact-lede">If this article raised a question worth answering, write. The director on duty replies within two working days.</p>
    <div class="contact-actions">
      <button type="button" class="btn-primary btn-large" data-open-enquire>Open the enquiry form</button>
    </div>
    <p class="direct">Or write directly: <a href="mailto:office@acmarine.com">office@acmarine.com</a></p>
  </div>
</section>

</main>`;

  return new Response(pageShell({
    title: title.slice(0, 80),
    description: description.slice(0, 158),
    canonical,
    ogImage: a.image_url || undefined,
    jsonLd: [articleLd, breadcrumbLd],
    body,
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
