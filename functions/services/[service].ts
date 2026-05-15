import { findService, LOCATIONS, SERVICES } from '../_lib/seo-data';
import { pageShell, esc } from '../_lib/page';

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = String(params.service || '').toLowerCase();
  const svc = findService(slug);
  if (!svc) return new Response('not found', { status: 404 });

  const canonical = `https://acmarine.com/services/${svc.slug}`;
  const title = `${svc.name}. Aldridge & Charles Marine.`;
  const description = `${svc.intro} Retained, by introduction, across the Mediterranean, the Atlantic, the Pacific, and the Indian Ocean.`;

  const otherServices = SERVICES.filter(s => s.slug !== svc.slug).slice(0, 4);
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: svc.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: svc.name,
    name: `${svc.name} by Aldridge & Charles Marine`,
    description: svc.description,
    provider: { '@type': 'ProfessionalService', name: 'Aldridge & Charles Marine', url: 'https://acmarine.com/' },
    areaServed: LOCATIONS.map(l => ({ '@type': 'Place', name: l.name })),
    audience: { '@type': 'Audience', audienceType: 'Yacht owners and principals' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://acmarine.com/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://acmarine.com/#services' },
      { '@type': 'ListItem', position: 3, name: svc.name, item: canonical },
    ],
  };

  const body = `
<main class="seo-page">

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a>
  <span aria-hidden="true">&rsaquo;</span>
  <a href="/#services">Services</a>
  <span aria-hidden="true">&rsaquo;</span>
  <span>${esc(svc.name)}</span>
</nav>

<section class="seo-hero">
  <p class="eyebrow">Service</p>
  <h1>${esc(svc.name)}.</h1>
  <p class="seo-lede">${esc(svc.tagline)}</p>
  <div class="hero-cta">
    <button type="button" class="btn-primary" data-open-inquire data-inquire-service="${esc(svc.name)}">Inquire about ${esc(svc.shortName)}</button>
  </div>
</section>

<section class="seo-body">
  <h2>${esc(svc.name)} at Aldridge &amp; Charles.</h2>
  <p class="seo-body-lede">${esc(svc.intro)}</p>
  <p>${esc(svc.description)}</p>
  <ul class="creed">
    ${svc.highlights.map(h => `<li><span>&sect;</span> ${esc(h)}</li>`).join('')}
  </ul>
</section>

<section class="seo-locations">
  <h2>Where we hold ${esc(svc.shortName.toLowerCase())} retainers.</h2>
  <p class="section-lede">The office answers from four addresses. Each holds standing arrangements with the priority marinas, surveyors, yards, and counsel in its region.</p>
  <div class="seo-location-grid">
    ${LOCATIONS.map(l => `
      <a class="seo-loc-card" href="/services/${svc.slug}/${l.slug}">
        <p class="card-meta">${esc(l.region)}</p>
        <h3>${esc(svc.shortName)} in ${esc(l.name)}.</h3>
        <p class="card-spec">${esc(l.harbours.slice(0, 2).join(' &middot; '))}</p>
      </a>
    `).join('')}
  </div>
</section>

<section class="seo-faq">
  <h2>Frequently asked.</h2>
  ${svc.faqs.map(f => `
    <details class="faq-item">
      <summary>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>
  `).join('')}
</section>

<section class="seo-related">
  <h2>Other practices.</h2>
  <div class="seo-related-grid">
    ${otherServices.map(s => `
      <a class="seo-related-card" href="/services/${s.slug}">
        <h3>${esc(s.name)}.</h3>
        <p>${esc(s.tagline)}</p>
      </a>
    `).join('')}
  </div>
</section>

<section class="contact" id="contact">
  <div class="contact-inner">
    <p class="eyebrow">Inquire</p>
    <h2>${esc(svc.shortName)} inquiries.</h2>
    <p class="contact-lede">Write to the office. The director on duty replies within two working days.</p>
    <div class="contact-actions">
      <button type="button" class="btn-primary btn-large" data-open-inquire data-inquire-service="${esc(svc.name)}">Open the inquiry form</button>
    </div>
    <p class="direct">Or write directly: <a href="mailto:office@acmarine.com">office@acmarine.com</a></p>
  </div>
</section>

</main>`;

  return new Response(pageShell({
    title,
    description: description.slice(0, 158),
    canonical,
    jsonLd: [serviceLd, faqLd, breadcrumbLd],
    body,
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600',
    },
  });
};
