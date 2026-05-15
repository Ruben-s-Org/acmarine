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
function openEnquire(listingSlug, service) {
  if (!enquireDialog) return;
  const form = enquireDialog.querySelector('#enquire-form');
  const hiddenSlug = form?.querySelector('input[name="listing_slug"]');
  if (hiddenSlug) hiddenSlug.value = listingSlug || '';
  const messageField = form?.querySelector('textarea[name="message"]');
  if (messageField) {
    let preset = '';
    if (service) preset = `I would like to enquire about your ${service} service.`;
    else if (listingSlug) preset = `Regarding ${listingSlug.replace(/-/g, ' ')}.`;
    if (preset && !messageField.value.trim()) messageField.value = preset;
  }
  const heading = enquireDialog.querySelector('#enquire-title');
  if (heading) {
    if (service) heading.textContent = `${service}. Enquire.`;
    else if (listingSlug) heading.textContent = `Request a viewing.`;
    else heading.textContent = `Write to the office.`;
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
    openEnquire(opener.dataset.listing || '', opener.dataset.enquireService || '');
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
