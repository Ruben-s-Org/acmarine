document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.querySelector('.nav-burger');
const drawer = document.getElementById('mobile-drawer');
if (burger && drawer) {
  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    if (open) drawer.removeAttribute('hidden');
    else drawer.setAttribute('hidden', '');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.querySelectorAll('a, button:not([data-open-enquire])').forEach(el => {
    el.addEventListener('click', () => setOpen(false));
  });
}

const enquireDialog = document.getElementById('enquire-dialog');
function openEnquire(listingSlug) {
  if (!enquireDialog) return;
  const form = enquireDialog.querySelector('#enquire-form');
  const hiddenSlug = form?.querySelector('input[name="listing_slug"]');
  if (hiddenSlug) hiddenSlug.value = listingSlug || '';
  const messageField = form?.querySelector('textarea[name="message"]');
  if (messageField && listingSlug && !messageField.value) {
    messageField.value = `Regarding ${listingSlug.replace(/-/g, ' ')}.`;
  }
  if (typeof enquireDialog.showModal === 'function') enquireDialog.showModal();
  else enquireDialog.setAttribute('open', '');
  if (burger?.getAttribute('aria-expanded') === 'true') burger.click();
}
function closeEnquire() {
  if (!enquireDialog) return;
  if (typeof enquireDialog.close === 'function') enquireDialog.close();
  else enquireDialog.removeAttribute('open');
}
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open-enquire]');
  if (opener) {
    e.preventDefault();
    openEnquire(opener.dataset.listing || '');
  }
  const closer = e.target.closest('[data-close-enquire]');
  if (closer) { e.preventDefault(); closeEnquire(); }
});
if (enquireDialog) {
  enquireDialog.addEventListener('click', (e) => {
    if (e.target === enquireDialog) closeEnquire();
  });
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function lengthLabel(l) {
  if (typeof l !== 'number' || !isFinite(l)) return '';
  const m = l.toFixed(1).replace(/\.0$/, '');
  const ft = (l * 3.28084).toFixed(0);
  return `${m} m / ${ft} ft`;
}

function renderPreviewCard(l) {
  const hero = l.hero_image
    ? `<img src="${escapeHtml(l.hero_image)}" alt="${escapeHtml(l.name)}" loading="lazy">`
    : `<div class="card-image-empty" aria-hidden="true">
        <svg viewBox="0 0 80 80" width="48" height="48"><circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="1"/><path d="M16 48 L40 64 L64 48" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M30 30 L40 50 L50 30" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>`;
  const meta = [l.builder, l.year].filter(Boolean).join(', ');
  const len = lengthLabel(l.loa_m);
  const status = l.status === 'sold' ? 'Sold' : l.status === 'sale-pending' ? 'Sale Pending' : 'Available';
  const statusClass = `is-${l.status || 'available'}`;
  return `<a class="yacht-card ${statusClass}" href="/yacht/${encodeURIComponent(l.slug)}">
    <div class="card-image">${hero}<span class="card-status">${escapeHtml(status)}</span></div>
    <div class="card-body">
      <p class="card-meta">${escapeHtml(meta || 'Private commission')}</p>
      <h3 class="card-name">${escapeHtml(l.name)}</h3>
      ${len ? `<p class="card-spec">${escapeHtml(len)}${l.location ? ' &middot; ' + escapeHtml(l.location) : ''}</p>` : ''}
      <p class="card-price">${escapeHtml(l.price || 'Price upon request')}</p>
    </div>
  </a>`;
}

const preview = document.querySelector('[data-fleet-preview]');
if (preview) {
  fetch('/api/listings').then(r => r.json()).then(data => {
    const items = (data.listings || []).filter(l => l.status !== 'draft').slice(0, 3);
    if (items.length === 0) {
      preview.innerHTML = '<p class="fleet-empty">The current roster is closed to public listings. Please write to the office.</p>';
      return;
    }
    preview.innerHTML = items.map(renderPreviewCard).join('');
  }).catch(() => {
    preview.innerHTML = '<p class="fleet-empty">Unable to load the fleet. Please write to the office.</p>';
  });
}

document.querySelectorAll('form.enquire-form, form.contact-form').forEach((form) => {
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      if (note) { note.textContent = 'Please complete every field.'; note.style.color = '#e8b34a'; }
      return;
    }
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (note) { note.textContent = 'Thank you. The office will write to you.'; note.style.color = ''; }
        form.reset();
        if (form.classList.contains('enquire-form')) {
          setTimeout(closeEnquire, 1400);
        }
      } else {
        if (note) { note.textContent = 'Something went wrong. Please write to office@acmarine.com directly.'; note.style.color = '#e8b34a'; }
      }
    } catch {
      if (note) { note.textContent = 'Network issue. Please write to office@acmarine.com directly.'; note.style.color = '#e8b34a'; }
    }
  });
});
