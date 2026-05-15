export function esc(s: any): string {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' } as any)[c]);
}

export function pageShell(opts: {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: any[];
  bodyClass?: string;
  body: string;
  ogImage?: string;
  robots?: string;
}): string {
  const ld = (opts.jsonLd || []).map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a1e3a">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<meta name="robots" content="${esc(opts.robots || 'index, follow, max-image-preview:large, max-snippet:-1')}">
<link rel="canonical" href="${esc(opts.canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Aldridge &amp; Charles Marine">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${esc(opts.canonical)}">
<meta property="og:image" content="${esc(opts.ogImage || 'https://acmarine.com/og.svg')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(opts.title)}">
<meta name="twitter:description" content="${esc(opts.description)}">
<meta name="twitter:image" content="${esc(opts.ogImage || 'https://acmarine.com/og.svg')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap"></noscript>
<link rel="stylesheet" href="/styles.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
${ld}
</head>
<body${opts.bodyClass ? ` class="${esc(opts.bodyClass)}"` : ''}>

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
    <a href="/articles" class="nav-link">Articles</a>
    <button type="button" class="nav-cta" data-open-inquire>Inquire</button>
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
    <a href="/articles" class="drawer-link">Articles</a>
    <a href="/contact" class="drawer-link">Contact</a>
    <button type="button" class="drawer-cta" data-open-inquire>Inquire</button>
  </nav>
</div>

${opts.body}

<dialog id="inquire-dialog" class="inquire-dialog" aria-labelledby="inquire-title">
  <div class="inquire-inner">
    <button type="button" class="dialog-close" data-close-inquire aria-label="Close">&times;</button>
    <p class="eyebrow">Inquire</p>
    <h2 id="inquire-title">Write to the office.</h2>
    <form class="inquire-form" id="inquire-form" novalidate>
      <label class="field"><span>Name</span><input type="text" name="name" autocomplete="name" required></label>
      <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required></label>
      <label class="field field-full"><span>Vessel or matter</span><textarea name="message" rows="5" required></textarea></label>
      <input type="hidden" name="listing_slug" value="">
      <button type="submit" class="btn-primary btn-block">Send</button>
      <p class="form-note" role="status" aria-live="polite"></p>
    </form>
    <p class="direct">Or write directly: <a href="mailto:office@acmarine.com">office@acmarine.com</a></p>
  </div>
</dialog>

<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-mark">Aldridge &amp; Charles Marine</p>
    <nav class="footer-nav" aria-label="Footer">
      <a href="/articles">Articles</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </nav>
    <p class="footer-fine">&copy; <span id="year"></span> Aldridge &amp; Charles Marine. All rights reserved.</p>
  </div>
</footer>

<script src="/acm-controls.js" defer></script>
<script src="/script.js" defer></script>
</body>
</html>`;
}
