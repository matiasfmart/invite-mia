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

  seal.addEventListener('pointerdown', () => seal.classList.add('pressing'));
  seal.addEventListener('pointerup', () => seal.classList.remove('pressing'));
  seal.addEventListener('pointercancel', () => seal.classList.remove('pressing'));

  seal.addEventListener('click', () => {
    seal.classList.remove('pressing');
    seal.classList.add('rippling');
    envelope.classList.add('opening');
    const box = seal.getBoundingClientRect();
    window.spawnFloralBurst?.(box.left + box.width / 2, box.top + box.height / 2);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.add('invitation-open');
    }, 1300);
  });
})();

// ==========================================================================
// STAGGERED REVEAL DELAYS (grids, timeline, gallery feel less "all at once")
// ==========================================================================
(function staggerReveals() {
  document.querySelectorAll('.cards-grid, .timeline, .gallery-grid, .palette-row').forEach(group => {
    group.querySelectorAll(':scope > .reveal, :scope > *').forEach((item, index) => {
      if (item.classList.contains('reveal') || item.querySelector('.reveal')) {
        const target = item.classList.contains('reveal') ? item : item.querySelector('.reveal');
        target.style.transitionDelay = `${Math.min(index * 0.09, 0.5)}s`;
      }
    });
  });
})();

// ==========================================================================
// TILT ON TOUCH/POINTER (mobile-first: tap gives a quick tilt pulse,
// mouse gets a smooth continuous follow — same listeners for both)
// ==========================================================================
(function tiltOnPointer() {
  const items = document.querySelectorAll('.royal-card, .gallery-frame, .gazette-sheet');
  const applyTilt = (item, clientX, clientY) => {
    const box = item.getBoundingClientRect();
    const px = (clientX - box.left) / box.width - 0.5;
    const py = (clientY - box.top) / box.height - 0.5;
    item.style.transform = `perspective(700px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
  };
  const resetTilt = (item) => { item.style.transform = ''; };

  items.forEach(item => {
    item.addEventListener('pointerdown', (e) => {
      applyTilt(item, e.clientX, e.clientY);
      if (e.pointerType === 'touch') setTimeout(() => resetTilt(item), 320);
    });
    item.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return; // avoid fighting page scroll on touch drag
      applyTilt(item, e.clientX, e.clientY);
    });
    item.addEventListener('pointerup', () => resetTilt(item));
    item.addEventListener('pointerleave', () => resetTilt(item));
    item.addEventListener('pointercancel', () => resetTilt(item));
  });
})();

// ==========================================================================
// NAV: wax-seal FAB that unrolls a parchment index + ribbon scroll marker
// ==========================================================================
(function nav() {
  const seal = document.getElementById('nav-seal');
  const scroll = document.getElementById('nav-scroll');
  const scrim = document.getElementById('nav-scrim');
  const ribbonFill = document.getElementById('ribbon-fill');
  const links = document.querySelectorAll('[data-nav]');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  function openMenu() {
    scroll.classList.add('open');
    scrim.classList.add('open');
    seal.classList.add('open');
    seal.setAttribute('aria-expanded', 'true');
    scroll.setAttribute('aria-hidden', 'false');
    const box = seal.getBoundingClientRect();
    window.spawnFloralBurst?.(box.left + box.width / 2, box.top + box.height / 2);
  }
  function closeMenu() {
    scroll.classList.remove('open');
    scrim.classList.remove('open');
    seal.classList.remove('open');
    seal.setAttribute('aria-expanded', 'false');
    scroll.setAttribute('aria-hidden', 'true');
  }

  seal.addEventListener('click', () => {
    scroll.classList.contains('open') ? closeMenu() : openMenu();
  });
  scrim.addEventListener('click', closeMenu);
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    ribbonFill.style.height = `${progress * 100}%`;

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
// PARALLAX ON HERO (mouse: follows cursor · touch: a one-shot nudge on tap
// so it never competes with scrolling the page)
// ==========================================================================
(function parallax() {
  const frame = document.querySelector('[data-parallax]');
  if (!frame) return;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    frame.style.transform = `translate(${x}px, ${y}px)`;
  });

  frame.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    const box = frame.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width - 0.5) * 8;
    const y = ((e.clientY - box.top) / box.height - 0.5) * 8;
    frame.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => { frame.style.transform = ''; }, 380);
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

  // Twinkling gold dust that lingers in place, like motes caught in candlelight.
  const MOTE_COUNT = reduceMotion ? 0 : Math.min(20, Math.floor(w / 40));
  const motes = Array.from({ length: MOTE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 1 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.03,
  }));

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

  // Tap/click anywhere (outside interactive controls) blooms a small burst
  // of flowers from the touch point — the invitation reacts to the reader.
  let bursts = [];
  function spawnBurst(x, y) {
    if (reduceMotion) return;
    const count = 10;
    for (let index = 0; index < count; index++) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.4;
      const speed = 1.4 + Math.random() * 2.2;
      bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        life: 0,
        maxLife: 46 + Math.random() * 20,
        color: Math.random() > 0.4 ? '216,183,180' : '185,154,97',
      });
    }
  }
  window.spawnFloralBurst = spawnBurst;

  // A finger dragged across the page leaves a trail of gold sparks.
  let sparkles = [];
  let lastSparkleAt = 0;
  function spawnSparkle(x, y) {
    if (reduceMotion || sparkles.length > 90) return;
    sparkles.push({
      x, y,
      vy: -0.4 - Math.random() * 0.5,
      size: 2 + Math.random() * 2.4,
      life: 0,
      maxLife: 26 + Math.random() * 14,
    });
  }
  document.addEventListener('pointermove', (e) => {
    if (e.buttons !== 1 && e.pointerType !== 'touch') return;
    const now = performance.now();
    if (now - lastSparkleAt < 35) return;
    lastSparkleAt = now;
    spawnSparkle(e.clientX, e.clientY);
  });

  const interactiveTag = /^(A|BUTTON|INPUT|TEXTAREA|SELECT|LABEL)$/;
  document.addEventListener('pointerdown', (e) => {
    if (interactiveTag.test(e.target.tagName) || e.target.closest('a, button, input, textarea, select, label')) return;
    spawnBurst(e.clientX, e.clientY);
  });

  function animate() {
    ctx.clearRect(0, 0, w, h);
    motes.forEach(m => {
      m.phase += m.speed;
      const twinkle = 0.15 + (Math.sin(m.phase) + 1) / 2 * 0.35;
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#e6cf8f';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      if (p.y > h + 20) Object.assign(p, makeParticle(), { y: -20 });
      drawPetal(p);
    });
    bursts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.vx *= 0.96;
      p.rotation += p.rotSpeed;
      p.life++;
      const fade = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = fade;
      drawPetal({ ...p, opacity: 0.7 });
      ctx.restore();
    });
    bursts = bursts.filter(p => p.life < p.maxLife);
    sparkles.forEach(p => {
      p.y += p.vy;
      p.life++;
      const fade = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.fillStyle = '#dfcf9a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    sparkles = sparkles.filter(p => p.life < p.maxLife);
    requestAnimationFrame(animate);
  }
  if (!reduceMotion) animate();
})();

// ==========================================================================
// SWATCH RIPPLE ON TAP
// ==========================================================================
(function swatchRipple() {
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('pointerdown', () => {
      swatch.classList.remove('rippling');
      void swatch.offsetWidth; // restart animation
      swatch.classList.add('rippling');
    });
  });
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
  const check = document.getElementById('copy-check');
  const msg = document.getElementById('copied-msg');
  aliasText.textContent = CONFIG.aliasBancario;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.aliasBancario);
    } catch {
      // fallback silencioso si el navegador bloquea el clipboard
    }
    check.classList.remove('drawn');
    void check.offsetWidth; // restart animation
    check.classList.add('drawn');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2200);
  });
})();

// ==========================================================================
// RSVP FORM -> WHATSAPP + CONFETTI
// ==========================================================================
(function rsvp() {
  const form = document.getElementById('rsvp-form');
  const submitBtn = form.querySelector('.rsvp-submit');
  const originalLabel = submitBtn.textContent;

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

    submitBtn.disabled = true;
    submitBtn.classList.add('sending');
    submitBtn.textContent = 'Enviando…';

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    setTimeout(() => {
      fireConfetti();
      window.open(url, '_blank', 'noopener');
      submitBtn.disabled = false;
      submitBtn.classList.remove('sending');
      submitBtn.textContent = originalLabel;
    }, 700);
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
