import { listSlug, Listing } from '../_lib/store';

interface Env { IMAGES: R2Bucket; }

function esc(s: any): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' } as any)[c]);
}

function lengthLabel(l?: number): string {
  if (typeof l !== 'number' || !isFinite(l)) return '';
  const m = l.toFixed(1).replace(/\.0$/, '');
  const ft = (l * 3.28084).toFixed(0);
  return `${m} m / ${ft} ft`;
}

function statusLabel(s?: string): string {
  if (s === 'sale-pending') return 'Sale Pending';
  if (s === 'sold') return 'Sold';
  return 'Available';
}

function renderHtml(l: Listing): string {
  const title = `${l.name}. Aldridge & Charles Marine.`;
  const desc = l.short || (l.description ? l.description.slice(0, 160) : '') || `${l.name}, presented by Aldridge & Charles Marine.`;
  const url = `https://acmarine.com/yacht/${encodeURIComponent(l.slug)}`;
  const len = lengthLabel(l.loa_m);
  const metaItems = [l.builder, l.year].filter(Boolean).join(', ');
  const heroImg = l.hero_image
    ? `<img src="${esc(l.hero_image)}" alt="${esc(l.name)}" width="1200" height="900">`
    : '<div class="yacht-hero-empty" aria-hidden="true"></div>';
  const gallery = (l.gallery || []).map(g => `<img src="${esc(g)}" alt="${esc(l.name)}" loading="lazy" width="800" height="600">`).join('');
  const specs = l.specs || {};
  const specRows = [
    ['Class', l.boatClass],
    ['Builder', l.builder],
    ['Model', l.boatModel],
    ['Year', l.year],
    ['Length overall', len],
    ['Beam', l.beam_m ? `${l.beam_m} m` : ''],
    ['Capacity', l.capacity ? `${l.capacity} guests` : ''],
    ['Engine', l.engine],
    ['Total Power', typeof l.power === 'number' ? `${l.power} hp` : ''],
    ['Engine Hours', typeof l.engineHours === 'number' ? l.engineHours.toLocaleString() : ''],
    ['Classification', l.class_society],
    ['Condition', l.condition ? l.condition.charAt(0).toUpperCase() + l.condition.slice(1) : ''],
    ['Location', l.location],
    ...Object.entries(specs),
  ].filter(([_, v]) => v).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');

  const specChips = [
    l.boatClass ? { label: 'Class', value: l.boatClass } : null,
    l.boatModel ? { label: 'Model', value: l.boatModel } : null,
    l.year ? { label: 'Year', value: String(l.year) } : null,
    len ? { label: 'Length', value: len } : null,
    typeof l.power === 'number' ? { label: 'Power', value: `${l.power} hp` } : null,
    typeof l.engineHours === 'number' ? { label: 'Engine Hours', value: l.engineHours.toLocaleString() } : null,
    l.capacity ? { label: 'Capacity', value: `${l.capacity} guests` } : null,
  ].filter(Boolean).map(c => `<div class="yacht-chip"><span>${esc((c as any).label)}</span><strong>${esc((c as any).value)}</strong></div>`).join('');

  const descHtml = (l.description || '').split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('');
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: l.name,
    description: desc,
    brand: l.builder ? { '@type': 'Brand', name: l.builder } : undefined,
    offers: l.price ? { '@type': 'Offer', priceCurrency: 'USD', priceSpecification: { '@type': 'PriceSpecification', price: l.price }, availability: l.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
  };
  if (l.hero_image) jsonLd.image = [l.hero_image];

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com' },
      { '@type': 'ListItem', position: 2, name: 'Fleet', item: 'https://acmarine.com/fleet' },
      { '@type': 'ListItem', position: 3, name: l.name },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0a1e3a">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Aldridge &amp; Charles Marine">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
${l.hero_image ? `<meta property="og:image" content="${esc(l.hero_image)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
${l.hero_image ? `<meta name="twitter:image" content="${esc(l.hero_image)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap">
<link rel="stylesheet" href="/styles.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>

<header class="site-header">
  <a href="/" class="brand" aria-label="Aldridge and Charles Marine">
    <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M22 22 L32 44 L42 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 22 L36 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M32 14 L32 50" fill="none" stroke="currentColor" stroke-width="0.6"/>
    </svg>
    <span class="brand-text">
      <span class="brand-name">Aldridge &amp; Charles</span>
      <span class="brand-sub">Marine</span>
    </span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <a href="/fleet" class="nav-link">Fleet</a>
    <a href="/#services" class="nav-link">Services</a>
    <a href="/#approach" class="nav-link">Approach</a>
    <button type="button" class="nav-cta" data-open-inquire data-listing="${esc(l.slug)}">Inquire</button>
    <button type="button" class="nav-burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
      <span></span><span></span><span></span>
    </button>
  </nav>
</header>

<div id="mobile-drawer" class="mobile-drawer" hidden>
  <nav aria-label="Mobile">
    <a href="/" class="drawer-link">Home</a>
    <a href="/fleet" class="drawer-link">Fleet</a>
    <a href="/#services" class="drawer-link">Services</a>
    <a href="/#approach" class="drawer-link">Approach</a>
    <button type="button" class="drawer-cta" data-open-inquire data-listing="${esc(l.slug)}">Inquire</button>
  </nav>
</div>

<main class="yacht-page">

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/fleet">Fleet</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span>${esc(l.name)}</span>
</nav>

<section class="yacht-hero">
  <div class="yacht-hero-image">${heroImg}<span class="card-status">${esc(statusLabel(l.status))}</span></div>
  <div class="yacht-hero-meta">
    <p class="eyebrow">${esc(metaItems || 'Private commission')}</p>
    <h1>${esc(l.name)}</h1>
    ${len ? `<p class="yacht-line">${esc(len)}${l.location ? ' &middot; ' + esc(l.location) : ''}</p>` : ''}
    <p class="yacht-price">${esc(l.price || 'Price upon request')}</p>
    ${l.short ? `<p class="yacht-short">${esc(l.short)}</p>` : ''}
    <button type="button" class="btn-primary" data-open-inquire data-listing="${esc(l.slug)}">Request a Viewing</button>
  </div>
</section>

${specChips ? `<section class="yacht-chips" aria-label="Specifications at a glance">${specChips}</section>` : ''}

${gallery ? `<section class="yacht-gallery">${gallery}</section>` : ''}

${descHtml ? `<section class="yacht-description"><h2>Notes from the office</h2>${descHtml}</section>` : ''}

${specRows ? `<section class="yacht-specs"><h2>Specification</h2><table>${specRows}</table></section>` : ''}

</main>

<dialog id="inquire-dialog" class="inquire-dialog" aria-labelledby="inquire-title">
  <div class="inquire-inner">
    <button type="button" class="dialog-close" data-close-inquire aria-label="Close">&times;</button>
    <p class="eyebrow">Inquire</p>
    <h2 id="inquire-title">Request a viewing of ${esc(l.name)}.</h2>
    <p class="inquire-lede">The director on duty replies within two working days.</p>
    <form class="inquire-form" id="inquire-form" novalidate>
      <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" required></label>
      <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required></label>
      <label class="field field-full"><span>Message</span><textarea name="message" rows="5" required>Regarding ${esc(l.name)}.</textarea></label>
      <input type="hidden" name="listing_slug" value="${esc(l.slug)}">
      <button type="submit" class="btn-primary btn-block">Send</button>
      <p class="form-note" role="status" aria-live="polite"></p>
    </form>
    <p class="direct">
      Or write directly:
      <a href="mailto:office@acmarine.com">office@acmarine.com</a>
    </p>
  </div>
</dialog>

<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-mark">Aldridge &amp; Charles Marine</p>
    <p class="footer-fine">&copy; <span id="year"></span> Aldridge &amp; Charles Marine. All rights reserved.</p>
  </div>
</footer>

<script src="/acm-controls.js" defer></script>
<script src="/script.js" defer></script>
</body>
</html>`;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const slug = String(params.slug || '').toLowerCase();
  const listing = await listSlug(env.IMAGES, slug);
  if (!listing || listing.status === 'draft') return new Response('not found', { status: 404 });
  return new Response(renderHtml(listing), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
};
