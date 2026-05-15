import { findService, findLocation, LOCATIONS, SERVICES } from '../../_lib/seo-data';
import { pageShell, esc } from '../../_lib/page';

export const onRequestGet: PagesFunction = async ({ params }) => {
  const sSlug = String(params.service || '').toLowerCase();
  const lSlug = String(params.location || '').toLowerCase();
  const svc = findService(sSlug);
  const loc = findLocation(lSlug);
  if (!svc || !loc) return new Response('not found', { status: 404 });

  const canonical = `https://acmarine.com/services/${svc.slug}/${loc.slug}`;
  const title = `${svc.name} in ${loc.name}. Aldridge & Charles Marine.`;
  const description = `${svc.name} in ${loc.name}: ${svc.tagline} A private marine office answering on the same telephone, in ${loc.name} and beyond.`.slice(0, 158);

  const otherLocationsForService = LOCATIONS.filter(l => l.slug !== loc.slug);
  const otherServicesForLocation = SERVICES.filter(s => s.slug !== svc.slug).slice(0, 4);

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: svc.name,
    name: `${svc.name} in ${loc.name} by Aldridge & Charles Marine`,
    description: `${svc.description.slice(0, 240)} Delivered in and from ${loc.name}, ${loc.region}.`,
    provider: { '@type': 'ProfessionalService', name: 'Aldridge & Charles Marine', url: 'https://acmarine.com/' },
    areaServed: { '@type': 'Place', name: loc.name, geo: loc.geo ? { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng } : undefined },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://acmarine.com/#services' },
      { '@type': 'ListItem', position: 3, name: svc.name, item: `https://acmarine.com/services/${svc.slug}` },
      { '@type': 'ListItem', position: 4, name: loc.name, item: canonical },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: svc.faqs.map(f => ({
      '@type': 'Question',
      name: `${f.q.replace(/\?$/, '')} (in ${loc.name})?`,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `https://acmarine.com/locations/${loc.slug}#office`,
    name: `Aldridge & Charles Marine ${loc.name}`,
    url: `https://acmarine.com/locations/${loc.slug}`,
    address: { '@type': 'PostalAddress', addressLocality: loc.name, addressCountry: loc.country },
    geo: loc.geo ? { '@type': 'GeoCoordinates', latitude: loc.geo.lat, longitude: loc.geo.lng } : undefined,
    areaServed: { '@type': 'Place', name: loc.region },
    knowsAbout: [svc.name, svc.shortName],
  };

  const body = `
<main class="seo-page">

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a>
  <span aria-hidden="true">&rsaquo;</span>
  <a href="/#services">Services</a>
  <span aria-hidden="true">&rsaquo;</span>
  <a href="/services/${esc(svc.slug)}">${esc(svc.name)}</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span>${esc(loc.name)}</span>
</nav>

<section class="seo-hero">
  <p class="eyebrow">${esc(svc.name)} &middot; ${esc(loc.name)}</p>
  <h1>${esc(svc.name)} in ${esc(loc.name)}.</h1>
  <p class="seo-lede">${esc(svc.tagline)} Delivered from ${esc(loc.name)}, ${esc(loc.region)}, by the same office that holds the brief everywhere else she sails.</p>
  <div class="hero-cta">
    <button type="button" class="btn-primary" data-open-inquire data-inquire-service="${esc(svc.name)} in ${esc(loc.name)}">Inquire about ${esc(svc.shortName)} in ${esc(loc.name)}</button>
  </div>
</section>

<section class="seo-body">
  <h2>${esc(svc.name)} in ${esc(loc.name)}.</h2>
  <p class="seo-body-lede">${esc(svc.intro)}</p>
  <p>${esc(svc.description)}</p>
  <h3 class="seo-sub">${esc(loc.name)}, in our experience.</h3>
  <p>${esc(loc.description)}</p>
  <ul class="creed">
    <li><span>&sect;</span> Standing arrangements with ${esc(loc.harbours.join(', '))}.</li>
    ${svc.highlights.slice(0, 3).map(h => `<li><span>&sect;</span> ${esc(h)}</li>`).join('')}
  </ul>
</section>

<section class="seo-locations">
  <h2>${esc(svc.shortName)} in other harbours.</h2>
  <p class="section-lede">The same office, the same standard, at every other address.</p>
  <div class="seo-location-grid">
    ${otherLocationsForService.map(l => `
      <a class="seo-loc-card" href="/services/${svc.slug}/${l.slug}">
        <p class="card-meta">${esc(l.region)}</p>
        <h3>${esc(svc.shortName)} in ${esc(l.name)}.</h3>
        <p class="card-spec">${esc(l.harbours.slice(0, 2).join(' &middot; '))}</p>
      </a>
    `).join('')}
  </div>
</section>

<section class="seo-related">
  <h2>Other practices in ${esc(loc.name)}.</h2>
  <div class="seo-related-grid">
    ${otherServicesForLocation.map(s => `
      <a class="seo-related-card" href="/services/${s.slug}/${loc.slug}">
        <h3>${esc(s.name)} in ${esc(loc.name)}.</h3>
        <p>${esc(s.tagline)}</p>
      </a>
    `).join('')}
  </div>
</section>

<section class="seo-faq">
  <h2>Frequently asked, in ${esc(loc.name)}.</h2>
  ${svc.faqs.map(f => `
    <details class="faq-item">
      <summary>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>
  `).join('')}
</section>

<section class="contact" id="contact">
  <div class="contact-inner">
    <p class="eyebrow">Inquire</p>
    <h2>${esc(svc.shortName)} in ${esc(loc.name)}.</h2>
    <p class="contact-lede">Write to the office. The director on duty replies within two working days.</p>
    <div class="contact-actions">
      <button type="button" class="btn-primary btn-large" data-open-inquire data-inquire-service="${esc(svc.name)} in ${esc(loc.name)}">Open the inquiry form</button>
    </div>
    <p class="direct">Or write directly: <a href="mailto:office@acmarine.com">office@acmarine.com</a></p>
  </div>
</section>

</main>`;

  return new Response(pageShell({
    title: title.slice(0, 70),
    description,
    canonical,
    jsonLd: [serviceLd, localBusinessLd, faqLd, breadcrumbLd],
    body,
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
