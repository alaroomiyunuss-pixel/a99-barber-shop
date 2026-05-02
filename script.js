// ── Language ──────────────────────────────────────────
let currentLang = localStorage.getItem('a99Lang') || 'nl';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('a99Lang', lang);
  const html = document.getElementById('htmlRoot');
  const body = document.body;
  const btn  = document.getElementById('langBtn');

  if (lang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.add('ar-mode');
    btn.textContent = '🌐 NL';
    document.title = 'A99 Barber Shop – هارلم، هولندا';
  } else {
    html.setAttribute('lang', 'nl');
    html.setAttribute('dir', 'ltr');
    body.classList.remove('ar-mode');
    btn.textContent = '🌐 AR';
    document.title = 'A99 Barber Shop – Haarlem, Nederland';
  }

  // Translate all data-nl / data-ar elements
  document.querySelectorAll('[data-nl],[data-ar]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = txt;
      } else if (el.tagName === 'OPTION') {
        el.textContent = txt;
      } else {
        el.innerHTML = txt;
      }
    }
  });

  // Update hero booking title direction
  document.querySelectorAll('.hero-book-form input,.hero-book-form select').forEach(el => {
    el.style.textAlign = lang === 'ar' ? 'right' : 'left';
  });
}

function toggleLang() {
  applyLang(currentLang === 'nl' ? 'ar' : 'nl');
}

// ── Loader ────────────────────────────────────────────
window.addEventListener('load', () => {
  applyLang(currentLang);
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2200);
});

// ── Navbar scroll ────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
});

// ── Mobile menu ──────────────────────────────────────
function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); }
function closeMenu()  { document.getElementById('navLinks').classList.remove('open'); }

// ── Back to top ──────────────────────────────────────
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── Time slot ─────────────────────────────────────────
let selectedTime = '';
function selectTime(el, t) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = t;
  document.getElementById('selectedTime').value = t;
}

// ── Min date ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  ['bookDate','qDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.min = today; el.value = today; }
  });
});

// ── Quick Hero Booking ────────────────────────────────
function quickBook(e) {
  e.preventDefault();
  const name  = document.getElementById('qName').value;
  const phone = document.getElementById('qPhone').value;
  const svc   = document.getElementById('qService').options[document.getElementById('qService').selectedIndex].text;
  const date  = document.getElementById('qDate').value;

  const msgNL = `Afspraak bevestigd!\n\nNaam: ${name}\nDienst: ${svc}\nDatum: ${date}\nWij nemen contact op via ${phone}`;
  const msgAR = `تم الحجز!\n\nالاسم: ${name}\nالخدمة: ${svc}\nالتاريخ: ${date}\nسنتواصل معك على ${phone}`;

  showModal(
    currentLang === 'ar' ? 'تم الحجز بنجاح! ✅' : 'Afspraak bevestigd! ✅',
    currentLang === 'ar' ? msgAR : msgNL
  );
  e.target.reset();
  document.getElementById('qDate').value = new Date().toISOString().split('T')[0];
}

// ── Main Booking Form ─────────────────────────────────
function submitBooking(e) {
  e.preventDefault();
  const name    = document.getElementById('fullName').value;
  const phone   = document.getElementById('phone').value;
  const svcEl   = document.getElementById('service');
  const svc     = svcEl.options[svcEl.selectedIndex].text;
  const date    = document.getElementById('bookDate').value;
  const time    = document.getElementById('selectedTime').value;

  if (!svcEl.value) {
    alert(currentLang === 'ar' ? 'الرجاء اختيار الخدمة' : 'Kies een dienst');
    return;
  }
  if (!time) {
    alert(currentLang === 'ar' ? 'الرجاء اختيار الوقت' : 'Kies een tijd');
    return;
  }

  const msgNL = `Naam: ${name} | Dienst: ${svc} | Datum: ${date} om ${time} | Tel: ${phone}`;
  const msgAR = `الاسم: ${name} | الخدمة: ${svc} | التاريخ: ${date} الساعة ${time} | هاتف: ${phone}`;

  showModal(
    currentLang === 'ar' ? 'تم الحجز! ✅' : 'Afspraak bevestigd! ✅',
    currentLang === 'ar' ? msgAR : msgNL
  );

  document.getElementById('bookingForm').reset();
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  selectedTime = '';
  document.getElementById('bookDate').value = new Date().toISOString().split('T')[0];
}

// ── Modal ─────────────────────────────────────────────
function showModal(title, msg) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = msg;
  document.getElementById('successModal').classList.add('show');
}
function closeModal() { document.getElementById('successModal').classList.remove('show'); }

// ── Testimonials slider ───────────────────────────────
let slide = 0;
const slides = () => document.querySelectorAll('.testimonial-card');
const dots   = () => document.querySelectorAll('.dot');

function goToSlide(n) {
  slides().forEach((s,i) => s.classList.toggle('active', i === n));
  dots().forEach((d,i) => d.classList.toggle('active', i === n));
  slide = n;
}
setInterval(() => goToSlide((slide + 1) % slides().length), 4500);

// ── Scroll animations ─────────────────────────────────
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));
