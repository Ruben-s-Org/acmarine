document.getElementById('year').textContent = new Date().getFullYear();

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const form = document.querySelector('.contact-form');
const note = form.querySelector('.form-note');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name || !data.email || !data.message) {
    note.textContent = 'Please complete every field.';
    note.style.color = '#e8b34a';
    return;
  }
  const subject = encodeURIComponent(`Enquiry from ${data.name}`);
  const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
  window.location.href = `mailto:office@acmarine.com?subject=${subject}&body=${body}`;
  note.textContent = 'Opening your mail application.';
  note.style.color = '';
});
