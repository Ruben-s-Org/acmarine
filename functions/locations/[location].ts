import { findLocation, SERVICES } from '../_lib/seo-data';
import { pageShell, esc } from '../_lib/page';

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = String(params.location || '').toLowerCase();
  const loc = findLocation(slug);
  if (!loc) return new Response('not found', { status: 404 });

  const canonical = `https://acmarine.com/locations/${loc.slug}`;
  const title = `${loc.name}. Aldridge & Charles Marine.`;
  const description = `Aldridge & Charles Marine in ${loc.name}, ${loc.region}: yacht management, brokerage, refit, charter, crew, detailing, engineering counsel, and concierge.`.slice(0, 158);

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${canonical}#office`,
    name: `Aldridge & Charles Marine ${loc.name}`,
    url: canonical,
    address: { '@type': 'PostalAddress', addressLocality: loc.name, addressCountry: loc.country },
    geo: loc.geo ? { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng } : undefined,
    areaServed: { '@type': 'Place', name: loc.region },
    knowsAbout: SERVICES.map(s => s.name),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://acmarine.com/locations' },
      { '@type': 'ListItem', position: 3, name: loc.name, item: canonical },
    ],
  };

  const body = `
<main class="seo-page">

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span>${esc(loc.name)}</span>
</nav>

<section class="seo-hero">
  <p class="eyebrow">${esc(loc.region)}</p>
  <h1>${esc(loc.name)}.</h1>
  <p class="seo-lede">${esc(loc.name)} is ${esc(loc.flavor)}.</p>
  <div class="hero-cta">
    <button type="button" class="btn-primary" data-open-inquire data-inquire-service="the ${esc(loc.name)} office">Inquire in ${esc(loc.name)}</button>
  </div>
</section>

<section class="seo-body">
  <h2>The office in ${esc(loc.name)}.</h2>
  <p>${esc(loc.description)}</p>
  <ul class="creed">
    <li><span>&sect;</span> Standing arrangements with ${esc(loc.harbours.join(', '))}.</li>
    <li><span>&sect;</span> One director on duty, on a direct line, in your time zone when the principal is aboard.</li>
    <li><span>&sect;</span> The same standard as our other addresses, the same telephone number that does not change.</li>
  </ul>
</section>

<section class="seo-locations">
  <h2>Practices we run in ${esc(loc.name)}.</h2>
  <p class="section-lede">Every service the office offers, delivered from ${esc(loc.name)}.</p>
  <div class="seo-location-grid">
    ${SERVICES.map(s => `
      <a class="seo-loc-card" href="/services/${s.slug}/${loc.slug}">
        <p class="card-meta">${esc(s.shortName)}</p>
        <h3>${esc(s.name)} in ${esc(loc.name)}.</h3>
        <p class="card-spec">${esc(s.tagline)}</p>
      </a>
    `).join('')}
  </div>
</section>

<section class="contact" id="contact">
  <div class="contact-inner">
    <p class="eyebrow">Inquire</p>
    <h2>Write to the ${esc(loc.name)} office.</h2>
    <p class="contact-lede">The director on duty replies within two working days.</p>
    <div class="contact-actions">
      <button type="button" class="btn-primary btn-large" data-open-inquire data-inquire-service="the ${esc(loc.name)} office">Open the inquiry form</button>
    </div>
    <p class="direct">Or write directly: <a href="mailto:office@acmarine.com">office@acmarine.com</a></p>
  </div>
</section>

</main>`;

  return new Response(pageShell({
    title,
    description,
    canonical,
    jsonLd: [localBusinessLd, breadcrumbLd],
    body,
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
