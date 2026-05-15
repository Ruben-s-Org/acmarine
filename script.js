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
  drawer.querySelectorAll('a, button:not([data-open-inquire])').forEach(el => {
    el.addEventListener('click', () => setOpen(false));
  });
}

const inquireDialog = document.getElementById('inquire-dialog');
function openInquire(listingSlug, service) {
  if (!inquireDialog) return;
  const form = inquireDialog.querySelector('#inquire-form');
  const hiddenSlug = form?.querySelector('input[name="listing_slug"]');
  if (hiddenSlug) hiddenSlug.value = listingSlug || '';
  const messageField = form?.querySelector('textarea[name="message"]');
  if (messageField) {
    let preset = '';
    if (service) preset = `I would like to inquire about your ${service} service.`;
    else if (listingSlug) preset = `Regarding ${listingSlug.replace(/-/g, ' ')}.`;
    if (preset && !messageField.value.trim()) messageField.value = preset;
  }
  const heading = inquireDialog.querySelector('#inquire-title');
  if (heading) {
    if (service) heading.textContent = `${service}. Inquire.`;
    else if (listingSlug) heading.textContent = `Request a viewing.`;
    else heading.textContent = `Write to the office.`;
  }
  if (typeof inquireDialog.showModal === 'function') inquireDialog.showModal();
  else inquireDialog.setAttribute('open', '');
  if (burger?.getAttribute('aria-expanded') === 'true') burger.click();
}
function closeInquire() {
  if (!inquireDialog) return;
  if (typeof inquireDialog.close === 'function') inquireDialog.close();
  else inquireDialog.removeAttribute('open');
}
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open-inquire]');
  if (opener) {
    e.preventDefault();
    openInquire(opener.dataset.listing || '', opener.dataset.inquireService || '');
  }
  const closer = e.target.closest('[data-close-inquire]');
  if (closer) { e.preventDefault(); closeInquire(); }
});
if (inquireDialog) {
  inquireDialog.addEventListener('click', (e) => {
    if (e.target === inquireDialog) closeInquire();
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

document.querySelectorAll('form.inquire-form, form.contact-form').forEach((form) => {
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      if (note) { note.textContent = 'Please complete every field.'; note.style.color = '#e8b34a'; }
      return;
    }
    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (note) { note.textContent = 'Thank you. The office will write to you.'; note.style.color = ''; }
        form.reset();
        if (form.classList.contains('inquire-form')) {
          setTimeout(closeInquire, 1400);
        }
      } else {
        if (note) { note.textContent = 'Something went wrong. Please write to office@acmarine.com directly.'; note.style.color = '#e8b34a'; }
      }
    } catch {
      if (note) { note.textContent = 'Network issue. Please write to office@acmarine.com directly.'; note.style.color = '#e8b34a'; }
    }
  });
});
