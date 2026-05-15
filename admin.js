const loginView = document.getElementById('login-view');
const dashView = document.getElementById('dashboard-view');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const loginNote = document.getElementById('login-note');
const newBtn = document.getElementById('new-listing-btn');
const dialog = document.getElementById('listing-dialog');
const listingForm = document.getElementById('listing-form');
const dialogTitle = document.getElementById('dialog-title');
const dialogNote = document.getElementById('dialog-note');
const dialogSave = document.getElementById('dialog-save');
const dialogCancel = document.getElementById('dialog-cancel');
const heroPreviewWrap = document.getElementById('hero-preview-wrap');
const heroPreview = document.getElementById('hero-preview');

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function show(view) {
  loginView.hidden = view !== 'login';
  dashView.hidden = view !== 'dashboard';
  logoutBtn.hidden = view !== 'dashboard';
}

async function checkAuth() {
  try {
    const res = await fetch('/api/admin/whoami');
    const data = await res.json();
    if (data.authenticated) {
      show('dashboard');
      loadListings();
      loadInquiries();
    } else {
      show('login');
    }
  } catch {
    show('login');
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = new FormData(loginForm).get('password');
  loginNote.textContent = 'Verifying.';
  loginNote.style.color = '';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      loginNote.textContent = '';
      show('dashboard');
      loadListings();
      loadInquiries();
    } else {
      loginNote.textContent = 'Incorrect key.';
      loginNote.style.color = '#b00020';
    }
  } catch {
    loginNote.textContent = 'Network issue.';
    loginNote.style.color = '#b00020';
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/admin/login', { method: 'DELETE' });
  show('login');
  loginForm.reset();
});

document.querySelectorAll('.tab-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('is-on', t === b));
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = p.id !== `tab-${b.dataset.tab}`);
  });
});

async function loadListings() {
  const wrap = document.getElementById('admin-listings');
  wrap.innerHTML = '<p class="admin-loading">Loading.</p>';
  try {
    const res = await fetch('/api/listings?drafts=1');
    const data = await res.json();
    const items = data.listings || [];
    if (items.length === 0) {
      wrap.innerHTML = '<p class="admin-loading">No listings yet. Add one to begin.</p>';
      return;
    }
    wrap.innerHTML = items.map(l => `
      <div class="admin-row" data-id="${escapeHtml(l.id)}">
        ${l.hero_image
          ? `<img src="${escapeHtml(l.hero_image)}" alt="" class="admin-row-img">`
          : '<div class="admin-row-img-empty">A&C</div>'}
        <div>
          <h3 class="admin-row-name">${escapeHtml(l.name)}</h3>
          <p class="admin-row-meta">
            ${escapeHtml([l.builder, l.year].filter(Boolean).join(', ') || 'Private')} &middot;
            ${escapeHtml(l.status || 'available')} &middot;
            <a href="/yacht/${encodeURIComponent(l.slug)}" target="_blank" rel="noopener">${escapeHtml(l.slug)}</a>
          </p>
        </div>
        <div class="admin-row-actions">
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="delete" class="danger">Delete</button>
        </div>
      </div>
    `).join('');
    wrap.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.admin-row').dataset.id;
        const item = items.find(x => x.id === id);
        if (item) openDialog(item);
      });
    });
    wrap.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.closest('.admin-row').dataset.id;
        const item = items.find(x => x.id === id);
        if (!confirm(`Delete listing "${item.name}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) loadListings();
        else alert('Delete failed.');
      });
    });
  } catch {
    wrap.innerHTML = '<p class="admin-loading">Error loading listings.</p>';
  }
}

async function loadInquiries() {
  const wrap = document.getElementById('admin-inquiries');
  wrap.innerHTML = '<p class="admin-loading">Loading.</p>';
  try {
    const res = await fetch('/api/inquiries');
    const data = await res.json();
    const items = data.inquiries || [];
    if (items.length === 0) {
      wrap.innerHTML = '<p class="admin-loading">No inquiries yet.</p>';
      return;
    }
    wrap.innerHTML = items.map(e => `
      <div class="inquiry-row">
        <div class="inquiry-head">
          <div>
            <span class="inquiry-name">${escapeHtml(e.name)}</span>
            <span class="inquiry-email"> &middot; <a href="mailto:${escapeHtml(e.email)}">${escapeHtml(e.email)}</a></span>
          </div>
          <span class="inquiry-date">${escapeHtml(new Date(e.created_at).toLocaleString())}</span>
        </div>
        ${e.listing_slug ? `<p class="inquiry-listing">Re: <a href="/yacht/${encodeURIComponent(e.listing_slug)}" target="_blank">${escapeHtml(e.listing_slug)}</a></p>` : ''}
        <p class="inquiry-msg">${escapeHtml(e.message)}</p>
      </div>
    `).join('');
  } catch {
    wrap.innerHTML = '<p class="admin-loading">Error loading inquiries.</p>';
  }
}

function openDialog(item) {
  dialogTitle.textContent = item ? 'Edit listing' : 'New listing';
  dialogNote.textContent = '';
  listingForm.reset();
  document.getElementById('f-id').value = item?.id || '';
  document.getElementById('f-name').value = item?.name || '';
  document.getElementById('f-slug').value = item?.slug || '';
  document.getElementById('f-builder').value = item?.builder || '';
  document.getElementById('f-boatmodel').value = item?.boatModel || '';
  document.getElementById('f-boatclass').value = item?.boatClass || '';
  document.getElementById('f-year').value = item?.year || '';
  document.getElementById('f-loa').value = item?.loa_m || '';
  document.getElementById('f-beam').value = item?.beam_m || '';
  document.getElementById('f-engine').value = item?.engine || '';
  document.getElementById('f-power').value = item?.power || '';
  document.getElementById('f-enginehours').value = item?.engineHours || '';
  document.getElementById('f-capacity').value = item?.capacity || '';
  document.getElementById('f-location').value = item?.location || '';
  document.getElementById('f-price').value = item?.price || '';
  document.getElementById('f-price-num').value = item?.price_num || '';
  document.getElementById('f-type').value = item?.type || '';
  document.getElementById('f-condition').value = item?.condition || '';
  document.getElementById('f-class').value = item?.class_society || '';
  document.getElementById('f-status').value = item?.status || 'available';
  document.getElementById('f-short').value = item?.short || '';
  document.getElementById('f-description').value = item?.description || '';
  document.getElementById('f-hero-url').value = item?.hero_image || '';
  document.getElementById('f-gallery').value = (item?.gallery || []).join('\n');
  document.getElementById('f-specs').value = Object.entries(item?.specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
  if (item?.hero_image) {
    heroPreview.src = item.hero_image;
    heroPreviewWrap.hidden = false;
  } else {
    heroPreviewWrap.hidden = true;
  }
  dialog.showModal();
}

newBtn.addEventListener('click', () => openDialog(null));
dialogCancel.addEventListener('click', () => dialog.close());

document.getElementById('f-hero-url').addEventListener('input', (e) => {
  if (e.target.value) {
    heroPreview.src = e.target.value;
    heroPreviewWrap.hidden = false;
  }
});

async function uploadOne(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('upload failed');
  return (await res.json()).url;
}

dialogSave.addEventListener('click', async () => {
  dialogNote.textContent = 'Saving.';
  dialogNote.style.color = '';
  try {
    const heroFile = document.getElementById('f-hero-file').files[0];
    let hero_image = document.getElementById('f-hero-url').value.trim();
    if (heroFile) {
      dialogNote.textContent = 'Uploading hero.';
      hero_image = await uploadOne(heroFile);
    }

    let gallery = document.getElementById('f-gallery').value
      .split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const galleryFiles = document.getElementById('f-gallery-files').files;
    if (galleryFiles && galleryFiles.length) {
      dialogNote.textContent = 'Uploading gallery.';
      for (const f of galleryFiles) {
        gallery.push(await uploadOne(f));
      }
    }

    const specsRaw = document.getElementById('f-specs').value;
    const specs = {};
    for (const line of specsRaw.split(/\r?\n/)) {
      const m = line.match(/^([^:]+):\s*(.+)$/);
      if (m) specs[m[1].trim()] = m[2].trim();
    }

    const payload = {
      id: document.getElementById('f-id').value || undefined,
      name: document.getElementById('f-name').value.trim(),
      slug: document.getElementById('f-slug').value.trim() || undefined,
      builder: document.getElementById('f-builder').value.trim() || undefined,
      boatModel: document.getElementById('f-boatmodel').value.trim() || undefined,
      boatClass: document.getElementById('f-boatclass').value || undefined,
      year: parseInt(document.getElementById('f-year').value) || undefined,
      loa_m: parseFloat(document.getElementById('f-loa').value) || undefined,
      beam_m: parseFloat(document.getElementById('f-beam').value) || undefined,
      engine: document.getElementById('f-engine').value.trim() || undefined,
      power: parseFloat(document.getElementById('f-power').value) || undefined,
      engineHours: parseFloat(document.getElementById('f-enginehours').value) || undefined,
      capacity: parseInt(document.getElementById('f-capacity').value) || undefined,
      location: document.getElementById('f-location').value.trim() || undefined,
      price: document.getElementById('f-price').value.trim() || undefined,
      price_num: parseFloat(document.getElementById('f-price-num').value) || undefined,
      type: document.getElementById('f-type').value || undefined,
      condition: document.getElementById('f-condition').value || undefined,
      class_society: document.getElementById('f-class').value.trim() || undefined,
      status: document.getElementById('f-status').value,
      short: document.getElementById('f-short').value.trim() || undefined,
      description: document.getElementById('f-description').value.trim() || undefined,
      hero_image: hero_image || undefined,
      gallery: gallery.length ? gallery : undefined,
      specs: Object.keys(specs).length ? specs : undefined,
    };

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      dialogNote.textContent = '';
      dialog.close();
      loadListings();
    } else {
      const err = await res.json().catch(() => ({}));
      dialogNote.textContent = `Save failed: ${err.error || res.status}`;
      dialogNote.style.color = '#b00020';
    }
  } catch (err) {
    dialogNote.textContent = `Error: ${err.message}`;
    dialogNote.style.color = '#b00020';
  }
});

checkAuth();
