document.getElementById('year').textContent = new Date().getFullYear();

const grid = document.getElementById('fleet-grid');
const searchForm = document.getElementById('fleet-search');
let allListings = [];
let lengthUnit = 'm';
let activeStatus = 'all';

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
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
    <div class="card-image">${hero}<span class="card-status">${escapeHtml(statusLabel(l.status))}</span></div>
    <div class="card-body">
      <p class="card-meta">${escapeHtml(meta || 'Private commission')}</p>
      <h3 class="card-name">${escapeHtml(l.name)}</h3>
      ${len ? `<p class="card-spec">${escapeHtml(len)}${l.location ? ' &middot; ' + escapeHtml(l.location) : ''}</p>` : ''}
      <p class="card-price">${escapeHtml(price)}</p>
    </div>
  </a>`;
}

function getFilters() {
  const fd = new FormData(searchForm);
  return {
    type: fd.get('type') || '',
    condition: fd.get('condition') || '',
    class_society: fd.get('class_society') || '',
    builder: (fd.get('builder') || '').toString().trim().toLowerCase(),
    loa_min: parseFloat(fd.get('loa_min')) || null,
    loa_max: parseFloat(fd.get('loa_max')) || null,
    year_min: parseInt(fd.get('year_min')) || null,
    year_max: parseInt(fd.get('year_max')) || null,
    price_min: parseFloat(fd.get('price_min')) || null,
    price_max: parseFloat(fd.get('price_max')) || null,
  };
}

function apply() {
  const f = getFilters();
  let items = allListings.slice();
  if (activeStatus !== 'all') items = items.filter(l => (l.status || 'available') === activeStatus);
  if (f.type) items = items.filter(l => l.type === f.type);
  if (f.condition) items = items.filter(l => l.condition === f.condition);
  if (f.class_society) items = items.filter(l => (l.class_society || '').toLowerCase().includes(f.class_society.toLowerCase()));
  if (f.builder) items = items.filter(l => (l.builder || '').toLowerCase().includes(f.builder));
  if (f.loa_min !== null || f.loa_max !== null) {
    items = items.filter(l => {
      if (typeof l.loa_m !== 'number') return false;
      const compM = lengthUnit === 'ft'
        ? { min: f.loa_min !== null ? f.loa_min / 3.28084 : null, max: f.loa_max !== null ? f.loa_max / 3.28084 : null }
        : { min: f.loa_min, max: f.loa_max };
      if (compM.min !== null && l.loa_m < compM.min) return false;
      if (compM.max !== null && l.loa_m > compM.max) return false;
      return true;
    });
  }
  if (f.year_min !== null || f.year_max !== null) {
    items = items.filter(l => {
      if (typeof l.year !== 'number') return false;
      if (f.year_min !== null && l.year < f.year_min) return false;
      if (f.year_max !== null && l.year > f.year_max) return false;
      return true;
    });
  }
  if (f.price_min !== null || f.price_max !== null) {
    items = items.filter(l => {
      if (typeof l.price_num !== 'number') return false;
      if (f.price_min !== null && l.price_num < f.price_min) return false;
      if (f.price_max !== null && l.price_num > f.price_max) return false;
      return true;
    });
  }
  if (items.length === 0) {
    grid.innerHTML = '<p class="fleet-empty">No vessels match these filters. Please write to the office for matters not yet presented publicly.</p>';
    return;
  }
  grid.innerHTML = items.map(renderCard).join('');
}

async function load() {
  try {
    const res = await fetch('/api/listings');
    const data = await res.json();
    allListings = (data.listings || []).filter(l => l.status !== 'draft');
    const builders = [...new Set(allListings.map(l => l.builder).filter(Boolean))].sort();
    const dl = document.getElementById('builders-list');
    if (dl) dl.innerHTML = builders.map(b => `<option value="${escapeHtml(b)}">`).join('');
    if (allListings.length === 0) {
      grid.innerHTML = '<p class="fleet-empty">The current roster is closed. Please write to the office to be introduced to vessels not yet presented publicly.</p>';
      return;
    }
    searchForm.hidden = false;
    apply();
  } catch (err) {
    grid.innerHTML = '<p class="fleet-empty">Unable to load the fleet at the moment. Please write to the office.</p>';
  }
}

searchForm.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
searchForm.addEventListener('reset', () => setTimeout(apply, 0));

searchForm.querySelectorAll('.fs-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    lengthUnit = btn.dataset.unit;
    searchForm.querySelectorAll('.fs-toggle button').forEach(b => b.classList.toggle('is-on', b === btn));
    apply();
  });
});

searchForm.querySelectorAll('.fs-statuses button').forEach(btn => {
  btn.addEventListener('click', () => {
    activeStatus = btn.dataset.status;
    searchForm.querySelectorAll('.fs-statuses button').forEach(b => b.classList.toggle('is-on', b === btn));
    apply();
  });
});

load();
