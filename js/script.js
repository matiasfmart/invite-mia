// ==========================================================================
// CONFIGURACIÓN EDITABLE — modificá estos valores según el evento real
// ==========================================================================
const CONFIG = {
  eventDate: '2026-10-30T21:30:00',           // Fecha y hora del evento
  whatsappNumber: '5491100000000',            // TODO: reemplazar por el número real (código país + área + número, sin +)
  aliasBancario: 'FiestadeMia',               // TODO: reemplazar por el alias/CBU real
};

// ==========================================================================
// ENVELOPE INTRO
// ==========================================================================
(function envelopeIntro() {
  const screen = document.getElementById('envelope-screen');
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('wax-seal');
  const root = document.documentElement;

  function resetToStart() {
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  resetToStart();
  window.addEventListener('pageshow', resetToStart, { once: true });

  seal.addEventListener('pointerdown', () => seal.classList.add('pressing'));
  seal.addEventListener('pointerup', () => seal.classList.remove('pressing'));
  seal.addEventListener('pointercancel', () => seal.classList.remove('pressing'));

  seal.addEventListener('click', () => {
    resetToStart();
    seal.classList.remove('pressing');
    seal.classList.add('rippling');
    envelope.classList.add('opening');
    window.startInvitationMusic?.();
    const box = seal.getBoundingClientRect();
    window.spawnFloralBurst?.(box.left + box.width / 2, box.top + box.height / 2);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      resetToStart();
      screen.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.add('invitation-open');
    }, 2000);
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
  const items = document.querySelectorAll('.royal-card, .gallery-frame, .welcome-portrait');
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
// NAV: "Tarjeta de baile" — a dance-card booklet that flips open from an
// edge tab, its programme built straight from the chapter sections.
// ==========================================================================
(function nav() {
  const tab = document.getElementById('nav-tab');
  const card = document.getElementById('nav-card');
  const scrim = document.getElementById('nav-scrim');
  const list = document.getElementById('nav-card-list');
  const ribbonFill = document.getElementById('ribbon-fill');
  const chapters = document.querySelectorAll('.chapter[id]');

  chapters.forEach(ch => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${ch.id}`;
    a.dataset.nav = '';
    a.dataset.roman = ch.dataset.chapter;
    a.textContent = ch.dataset.chapterName;
    li.appendChild(a);
    list.appendChild(li);
  });

  const links = document.querySelectorAll('[data-nav]');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  function openMenu() {
    card.classList.add('open');
    scrim.classList.add('open');
    tab.classList.add('open');
    tab.setAttribute('aria-expanded', 'true');
    card.setAttribute('aria-hidden', 'false');
    const box = tab.getBoundingClientRect();
    window.spawnFloralBurst?.(box.left, box.top + box.height / 2);
  }
  function closeMenu() {
    card.classList.remove('open');
    scrim.classList.remove('open');
    tab.classList.remove('open');
    tab.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-hidden', 'true');
  }

  tab.addEventListener('click', () => {
    card.classList.contains('open') ? closeMenu() : openMenu();
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
// CHAPTER MARKER + PAGE-TURN TRANSITION BETWEEN SECTIONS
// ==========================================================================
(function chapters() {
  const chapters = document.querySelectorAll('.chapter');
  const markerNum = document.getElementById('chapter-marker-num');
  const markerName = document.getElementById('chapter-marker-name');
  if (!chapters.length || !markerNum) return;

  const roseLayouts = new Map([
    ['hero', ['left']],
    ['gazette', ['right']],
    ['secreto-rosa', ['left', 'right']],
    ['countdown-section', ['left']],
    ['detalles', ['right']],
    ['galeria', ['left', 'right']],
    ['confirmar', ['right']],
  ]);

  function createVine(side) {
    return `
      <span class="chapter-vine chapter-vine--${side}" aria-hidden="true">
        <svg class="vine-stem-art" viewBox="0 0 100 300" preserveAspectRatio="none"><use href="#botanical-vine-stem"/></svg>
        <span class="vine-leaf vine-leaf--1"></span><span class="vine-leaf vine-leaf--2"></span>
        <svg class="botanical-rose rose-bloom--1" viewBox="0 0 80 130"><use class="botanical-rose__stem" href="#botanical-rose-stem"/><use class="botanical-rose__bloom" href="#botanical-rose-bloom"/><use class="botanical-rose__light" href="#botanical-rose-light"/></svg>
        <svg class="botanical-rose rose-bloom--2" viewBox="0 0 80 130"><use class="botanical-rose__stem" href="#botanical-rose-stem"/><use class="botanical-rose__bloom" href="#botanical-rose-bloom"/><use class="botanical-rose__light" href="#botanical-rose-light"/></svg>
      </span>
    `;
  }

  chapters.forEach(chapter => {
    const sides = roseLayouts.get(chapter.id);
    if (sides) chapter.insertAdjacentHTML('beforeend', sides.map(createVine).join(''));
  });

  const turnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        turnObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  chapters.forEach(ch => turnObserver.observe(ch));

  const markerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        markerNum.textContent = `Capítulo ${entry.target.dataset.chapter}`;
        markerName.textContent = entry.target.dataset.chapterName;
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
  chapters.forEach(ch => markerObserver.observe(ch));
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
  const live = document.getElementById('countdown-live');
  const scale = document.getElementById('alm-scale-fill');
  const labels = { days: 'días', hours: 'horas', mins: 'minutos' };
  const windowMs = 365 * 86400000;
  const cells = {};

  ['days', 'hours', 'mins', 'secs'].forEach(unit => {
    const host = document.querySelector(`[data-unit="${unit}"]`);
    if (!host) return;
    cells[unit] = { host, digit: host.querySelector('.alm-digit'), value: null };
  });

  let lastMinuteAnnounced = null;

  function setCell(unit, value) {
    const cell = cells[unit];
    if (!cell || cell.value === value) return;
    cell.digit.textContent = value;
    cell.value = value;
    cell.host.classList.remove('struck');
    void cell.host.offsetWidth;
    cell.host.classList.add('struck');
  }

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const values = { days, hours, mins, secs };
    Object.entries(values).forEach(([unit, value]) => {
      setCell(unit, String(value).padStart(2, '0'));
    });

    if (scale) {
      const elapsed = Math.min(1, Math.max(0, 1 - diff / windowMs));
      scale.style.width = `${elapsed * 100}%`;
    }

    if (live && mins !== lastMinuteAnnounced) {
      lastMinuteAnnounced = mins;
      live.textContent = `Faltan ${days} ${labels.days}, ${hours} ${labels.hours} y ${mins} ${labels.mins}.`;
    }
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
  const backCanvas = document.createElement('canvas');
  backCanvas.id = 'petals-back-canvas';
  const backCtx = backCanvas.getContext('2d');
  let w, h, documentHeight, particles;

  document.body.append(backCanvas, canvas);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    backCanvas.width = w;
    backCanvas.height = h;
    documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  }
  window.addEventListener('resize', resize);
  resize();

  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(() => {
      documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    });
    sizeObserver.observe(document.body);
  }

  function makeParticle(startOnScreen = false) {
    const foreground = Math.random() < 0.38;
    const depth = foreground ? 0.9 + Math.random() * 0.5 : 0.48 + Math.random() * 0.48;
    return {
      layer: foreground ? 'front' : 'back',
      x: Math.random() * w,
      y: startOnScreen ? window.scrollY + Math.random() * h : Math.random() * documentHeight,
      size: (4 + Math.random() * 6) * depth,
      speedY: (0.32 + Math.random() * 0.62) * depth,
      speedX: (Math.random() - 0.5) * 0.42,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.035,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.012 + Math.random() * 0.018,
      sway: 0.18 + Math.random() * 0.38,
      opacity: (foreground ? 0.3 + Math.random() * 0.25 : 0.18 + Math.random() * 0.2) * depth,
      color: Math.random() > 0.28 ? '217,109,140' : '110,52,70',
    };
  }

  const COUNT = reduceMotion ? 0 : Math.min(90, Math.max(40, Math.ceil(documentHeight / 125)));
  particles = Array.from({ length: COUNT }, (_, index) => {
    const particle = makeParticle(false);
    particle.y = ((index + Math.random() * 0.65) / COUNT) * documentHeight;
    return particle;
  });

  // Twinkling gold dust that lingers in place, like motes caught in candlelight.
  const MOTE_COUNT = reduceMotion ? 0 : Math.min(20, Math.floor(w / 40));
  const motes = Array.from({ length: MOTE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 1 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.03,
  }));

  function drawPetal(p, target = ctx) {
    target.save();
    target.translate(p.x, p.y);
    target.rotate(p.rotation);
    const flutter = 0.35 + Math.abs(Math.sin(p.phase)) * 0.65;
    target.scale(1, flutter);
    const gradient = target.createRadialGradient(-p.size * 0.28, -p.size * 0.38, 0, 0, 0, p.size * 1.2);
    gradient.addColorStop(0, `rgba(240,169,184,${Math.min(0.9, p.opacity + 0.2)})`);
    gradient.addColorStop(0.42, `rgba(${p.color},${p.opacity})`);
    gradient.addColorStop(1, `rgba(91,43,57,${Math.max(0.18, p.opacity - 0.12)})`);
    target.fillStyle = gradient;
    target.shadowColor = 'rgba(110,52,70,0.24)';
    target.shadowBlur = p.size * 0.45;
    target.beginPath();
    target.moveTo(0, -p.size);
    target.bezierCurveTo(p.size * 0.95, -p.size * 0.5, p.size * 0.78, p.size * 0.62, p.size * 0.08, p.size);
    target.bezierCurveTo(-p.size * 0.64, p.size * 0.7, -p.size * 0.92, -p.size * 0.28, 0, -p.size);
    target.fill();
    target.shadowBlur = 0;
    target.strokeStyle = `rgba(243,233,210,${p.opacity * 0.36})`;
    target.lineWidth = Math.max(0.5, p.size * 0.07);
    target.beginPath();
    target.moveTo(0, -p.size * 0.75);
    target.quadraticCurveTo(-p.size * 0.1, 0, p.size * 0.08, p.size * 0.72);
    target.stroke();
    target.restore();
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
        color: Math.random() > 0.2 ? '217,109,140' : '110,52,70',
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
    backCtx.clearRect(0, 0, w, h);
    motes.forEach(m => {
      m.phase += m.speed;
      const twinkle = 0.15 + (Math.sin(m.phase) + 1) / 2 * 0.35;
      backCtx.save();
      backCtx.globalAlpha = twinkle;
      backCtx.fillStyle = '#d4af37';
      backCtx.beginPath();
      backCtx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      backCtx.fill();
      backCtx.restore();
    });
    particles.forEach(p => {
      p.y += p.speedY;
      p.phase += p.phaseSpeed;
      p.x += p.speedX + Math.sin(p.phase) * p.sway;
      p.rotation += p.rotSpeed;
      if (p.y > documentHeight + 24) p.y = -24;
      if (p.x < -24) p.x = w + 20;
      if (p.x > w + 24) p.x = -20;
      const viewportY = p.y - window.scrollY;
      if (viewportY > -30 && viewportY < h + 30) {
        drawPetal({ ...p, y: viewportY }, p.layer === 'front' ? ctx : backCtx);
      }
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
      ctx.fillStyle = '#d4af37';
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

// Taps on interactive keepsakes release a small floral burst on touch devices.
(function mobileTapFlourish() {
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    const target = event.target.closest('.btn, .gallery-frame, .swatch, .lightbox-close');
    if (!target) return;
    const box = target.getBoundingClientRect();
    window.spawnFloralBurst?.(box.left + box.width / 2, box.top + box.height / 2);
  });
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
// ORACLE CARD: tap to flip and reveal the augury
// ==========================================================================
(function oracleCard() {
  const card = document.getElementById('oracle-card');
  if (!card) return;
  card.addEventListener('click', () => {
    const flipped = card.classList.toggle('flipped');
    card.setAttribute('aria-expanded', String(flipped));
    if (flipped) {
      const box = card.getBoundingClientRect();
      window.spawnFloralBurst?.(box.left + box.width / 2, box.top + box.height / 2);
    }
  });
})();

// ==========================================================================
// LOOPING BACKGROUND MUSIC
// ==========================================================================
(function music() {
  const indicator = document.getElementById('music-indicator');
  const audio = document.getElementById('bg-music');
  const trail = indicator.querySelector('.music-trail');
  const noteTemplates = [...trail.querySelectorAll('.air-note')];
  let noteTimer = null;
  let lastNoteTemplate = null;
  let lastOrientation = null;
  let orientationRun = 0;

  audio.loop = true;
  audio.volume = 0.72;

  function scheduleNote() {
    if (noteTimer) return;
    const shortBurst = Math.random() < 0.72;
    const delay = shortBurst ? 350 + Math.random() * 400 : 900 + Math.random() * 700;
    noteTimer = setTimeout(emitNote, delay);
  }

  function emitNote() {
    noteTimer = null;
    if (!indicator.classList.contains('playing') || document.hidden) {
      scheduleNote();
      return;
    }

    const activeNotes = trail.querySelectorAll('.air-note.sounding');
    if (activeNotes.length >= 7) {
      noteTimer = setTimeout(emitNote, 320);
      return;
    }

    const available = noteTemplates.filter(note => note !== lastNoteTemplate);
    const template = available[Math.floor(Math.random() * available.length)];
    const note = template.cloneNode(true);
    note.classList.remove('sounding');
    note.setAttribute('aria-hidden', 'true');
    const duration = 6.8 + Math.random() * 2;
    const sway = 7 + Math.random() * 10;
    const swayDirection = Math.random() < 0.5 ? -1 : 1;
    note.style.setProperty('--note-duration', `${duration.toFixed(2)}s`);
    note.style.setProperty('--tilt-a', `${(sway * swayDirection).toFixed(1)}deg`);
    note.style.setProperty('--tilt-b', `${(-sway * 0.8 * swayDirection).toFixed(1)}deg`);
    if (template.hasAttribute('data-flippable')) {
      let upsideDown = Math.random() < 0.5;
      if (upsideDown === lastOrientation && orientationRun >= 2) upsideDown = !upsideDown;
      orientationRun = upsideDown === lastOrientation ? orientationRun + 1 : 1;
      lastOrientation = upsideDown;
      note.style.setProperty('--orientation', upsideDown ? '180deg' : '0deg');
    } else {
      note.style.setProperty('--orientation', '0deg');
    }
    note.classList.add('sounding');
    note.addEventListener('animationend', () => note.remove(), { once: true });
    trail.appendChild(note);
    lastNoteTemplate = template;
    scheduleNote();
  }

  function startNoteStream() {
    if (!noteTimer && !trail.querySelector('.air-note.sounding')) emitNote();
  }

  function start() {
    indicator.classList.add('loading');
    return audio.play().then(() => {
      indicator.classList.remove('loading', 'blocked');
      indicator.classList.add('playing');
      indicator.setAttribute('aria-label', 'Música de fondo reproduciéndose');
      startNoteStream();
    }).catch(() => {
      indicator.classList.remove('loading', 'playing');
      indicator.classList.add('blocked');
      indicator.setAttribute('aria-label', 'Música pendiente de reproducción');
    });
  }

  window.startInvitationMusic = start;
  audio.addEventListener('playing', () => {
    indicator.classList.add('playing');
    startNoteStream();
  });
  audio.addEventListener('ended', start);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && document.body.classList.contains('invitation-open') && audio.paused) start();
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
      `Confirmación Quince Años de Mia`,
      `Nombre: ${name}`,
      `Asistencia: ${attend}`,
      `Invitados: ${guests}`,
      message ? `Mensaje: ${message}` : null,
    ].filter(Boolean).join('\n');

    submitBtn.disabled = true;
    submitBtn.classList.add('sending');
    submitBtn.textContent = 'Enviando...';

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

  const colors = ['#D4AF37', '#B8963E', '#D96D8C', '#F5EFE1', '#6F7450'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 1.4) * 16,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    petal: Math.random() > 0.5,
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
        if (p.petal) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }
    });
    if (alive) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}
