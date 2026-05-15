# Aldridge & Charles Marine (ACMarine)

Static landing page for Aldridge & Charles Marine, a bespoke yacht stewardship firm.

## Stack
Plain HTML, CSS, vanilla JS. No build step. Deployed to Cloudflare Pages.

## Local preview
Any static server works:
```
python3 -m http.server 8080
```
Then open http://localhost:8080.

## Deploy
```
wrangler pages deploy . --project-name=acmarine --branch=main
```

## Files
- `index.html` markup
- `styles.css` design system
- `script.js` reveal animations and contact form
- `favicon.svg` brand mark
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` SEO and agent readiness
- `_headers` security headers for Cloudflare Pages
