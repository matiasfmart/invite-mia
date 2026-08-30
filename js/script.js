// ==========================================================================
// CONFIGURACIÓN EDITABLE — modificá estos valores según el evento real
// ==========================================================================
const CONFIG = {
  eventDate: '2026-10-30T20:00:00',           // Fecha y hora del evento
  whatsappNumber: '5491100000000',            // TODO: reemplazar por el número real (código país + área + número, sin +)
  aliasBancario: 'alias.mia.xv15',            // TODO: reemplazar por el alias/CBU real
};

// ==========================================================================
// ENVELOPE INTRO
// ==========================================================================
(function envelopeIntro() {
  const screen = document.getElementById('envelope-screen');
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('wax-seal');

  seal.addEventListener('click', () => {
    envelope.classList.add('opening');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.add('invitation-open');
    }, 1300);
  });
})();

// ==========================================================================
// NAV: scrolled state + active link + smooth close on mobile
// ==========================================================================
(function nav() {
  const nav = document.getElementById('site-nav');
  const progress = document.getElementById('reading-progress');
  const links = document.querySelectorAll('[data-nav]');
  const toggle = document.getElementById('nav-toggle');
  const linksContainer = document.getElementById('nav-links');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  toggle.addEventListener('click', () => {
    const open = linksContainer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
  });

  links.forEach(link => link.addEventListener('click', () => {
    linksContainer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir navegación');
  }));

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;

    let currentIndex = -1;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= 140) currentIndex = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === currentIndex));
  }, { passive: true });
})();

// ==========================================================================
// SCROLL REVEAL
// ==========================================================================
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
})();

// ==========================================================================
// PARALLAX ON HERO
// ==========================================================================
(function parallax() {
  const frame = document.querySelector('[data-parallax]');
  if (!frame) return;
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    frame.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

// ==========================================================================
// COUNTDOWN
// ==========================================================================
(function countdown() {
  const target = new Date(CONFIG.eventDate).getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };
  let prev = {};

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const values = { days, hours, mins, secs };
    Object.entries(values).forEach(([key, val]) => {
      const str = String(val).padStart(2, '0');
      if (prev[key] !== str) {
        els[key].textContent = str;
        els[key].classList.remove('tick');
        void els[key].offsetWidth; // restart animation
        els[key].classList.add('tick');
        prev[key] = str;
      }
    });
  }
  tick();
  setInterval(tick, 1000);
})();

// ==========================================================================
// FLOATING PETALS / SPARKLES CANVAS
// ==========================================================================
(function petals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeParticle(startOnScreen = false) {
    return {
      x: Math.random() * w,
      y: startOnScreen ? Math.random() * h : Math.random() * -h,
      size: 4 + Math.random() * 7,
      speedY: 0.35 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.55,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.26 + Math.random() * 0.32,
      color: Math.random() > 0.35 ? '216,183,180' : '238,218,183',
    };
  }

  const COUNT = reduceMotion ? 0 : Math.min(52, Math.floor(w / 24));
  particles = Array.from({ length: COUNT }, () => makeParticle(true));

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    for (let index = 0; index < 5; index++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -p.size / 2, p.size * 0.42, p.size * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(185,154,97,${Math.min(0.7, p.opacity + 0.2)})`;
    ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      if (p.y > h + 20) Object.assign(p, makeParticle(), { y: -20 });
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }
  if (!reduceMotion) animate();
})();

// ==========================================================================
// MUSIC TOGGLE
// ==========================================================================
(function music() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.play().catch(() => {
        console.warn('Agregá un archivo de audio en assets/music/song.mp3 para habilitar la música.');
      });
      btn.classList.add('playing');
    } else {
      audio.pause();
      btn.classList.remove('playing');
    }
    playing = !playing;
  });
})();

// ==========================================================================
// GALLERY LIGHTBOX
// ==========================================================================
(function gallery() {
  const frames = document.querySelectorAll('.gallery-frame');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  frames.forEach(frame => {
    frame.addEventListener('click', () => {
      if (frame.classList.contains('placeholder')) return;
      const img = frame.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ==========================================================================
// COPY ALIAS BANCARIO
// ==========================================================================
(function copyAlias() {
  const aliasText = document.getElementById('alias-text');
  const copyBtn = document.getElementById('copy-alias');
  const msg = document.getElementById('copied-msg');
  aliasText.textContent = CONFIG.aliasBancario;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.aliasBancario);
    } catch {
      // fallback silencioso si el navegador bloquea el clipboard
    }
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2200);
  });
})();

// ==========================================================================
// RSVP FORM -> WHATSAPP + CONFETTI
// ==========================================================================
(function rsvp() {
  const form = document.getElementById('rsvp-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const attend = document.getElementById('rsvp-attend').value;
    const guests = document.getElementById('rsvp-guests').value;
    const message = document.getElementById('rsvp-message').value.trim();

    const text = [
      `👑 Confirmación Quince Años de Mia 👑`,
      `Nombre: ${name}`,
      `Asistencia: ${attend}`,
      `Invitados: ${guests}`,
      message ? `Mensaje: ${message}` : null,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    fireConfetti();
    setTimeout(() => window.open(url, '_blank', 'noopener'), 500);
  });
})();

// ==========================================================================
// CONFETTI BURST
// ==========================================================================
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#B99A61', '#D8B7B4', '#BD8F92', '#FFFDFB', '#DFCFaa'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 1.4) * 16,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    life: 0,
  }));

  let frame = 0;
  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;
      if (p.life < 130) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / 130);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}
