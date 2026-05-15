document.getElementById('year').textContent = new Date().getFullYear();

const grid = document.getElementById('fleet-grid');
const filters = document.getElementById('fleet-filters');
let allListings = [];
let activeFilter = 'all';

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function lengthLabel(l) {
  if (typeof l !== 'number' || !isFinite(l)) return '';
  const m = l.toFixed(1).replace(/\.0$/, '');
  const ft = (l * 3.28084).toFixed(0);
  return `${m} m / ${ft} ft`;
}

function statusLabel(s) {
  if (s === 'sale-pending') return 'Sale Pending';
  if (s === 'sold') return 'Sold';
  if (s === 'draft') return 'Draft';
  return 'Available';
}

function renderCard(l) {
  const hero = l.hero_image
    ? `<img src="${escapeHtml(l.hero_image)}" alt="${escapeHtml(l.name)}" loading="lazy">`
    : `<div class="card-image-empty" aria-hidden="true">
        <svg viewBox="0 0 80 80" width="48" height="48"><circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="1"/><path d="M16 48 L40 64 L64 48" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M30 30 L40 50 L50 30" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>`;
  const meta = [l.builder, l.year].filter(Boolean).join(', ');
  const len = lengthLabel(l.loa_m);
  const price = l.price || 'Price upon request';
  const statusClass = `is-${l.status || 'available'}`;

  return `<a class="yacht-card ${statusClass}" href="/yacht/${encodeURIComponent(l.slug)}">
    <div class="card-image">
      ${hero}
      <span class="card-status">${escapeHtml(statusLabel(l.status))}</span>
    </div>
    <div class="card-body">
      <p class="card-meta">${escapeHtml(meta || 'Private commission')}</p>
      <h3 class="card-name">${escapeHtml(l.name)}</h3>
      ${len ? `<p class="card-spec">${escapeHtml(len)}${l.location ? ' &middot; ' + escapeHtml(l.location) : ''}</p>` : ''}
      <p class="card-price">${escapeHtml(price)}</p>
    </div>
  </a>`;
}

function render() {
  let items = allListings;
  if (activeFilter !== 'all') items = items.filter(l => (l.status || 'available') === activeFilter);
  if (items.length === 0) {
    grid.innerHTML = '<p class="fleet-empty">No vessels currently match. Please write to the office for matters not yet presented.</p>';
    return;
  }
  grid.innerHTML = items.map(renderCard).join('');
}

async function load() {
  try {
    const res = await fetch('/api/listings');
    const data = await res.json();
    allListings = (data.listings || []).filter(l => l.status !== 'draft');
    if (allListings.length === 0) {
      grid.innerHTML = '<p class="fleet-empty">The current roster is closed. Please write to the office to be introduced to vessels not yet presented publicly.</p>';
      return;
    }
    filters.hidden = false;
    render();
  } catch (err) {
    grid.innerHTML = '<p class="fleet-empty">Unable to load the fleet at the moment. Please write to the office.</p>';
  }
}

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  filters.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b === btn));
  render();
});

load();
