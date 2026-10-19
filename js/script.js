(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Loader ----------
  const finishLoading = () => root.classList.add('loaded');
  window.addEventListener('load', () => setTimeout(finishLoading, 500));
  setTimeout(finishLoading, 2500); // fallback if some asset hangs

  // ---------- Split hero title into animated letters ----------
  let charIndex = 0;
  document.querySelectorAll('.hero-title .split').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.setProperty('--i', charIndex++);
      span.setAttribute('aria-hidden', 'true');
      el.append(span);
    });
  });

  // ---------- Typed role text ----------
  const typed = document.querySelector('.typed');
  if (typed) {
    const words = JSON.parse(typed.dataset.words);
    let word = 0;
    let len = 0;
    let deleting = false;
    const tick = () => {
      const current = words[word];
      len += deleting ? -1 : 1;
      typed.textContent = current.slice(0, len);
      let delay = deleting ? 45 : 90;
      if (!deleting && len === current.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && len === 0) {
        deleting = false;
        word = (word + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    if (reduceMotion) typed.textContent = words[0];
    else setTimeout(tick, 1600);
  }

  // ---------- Split about text into words for scroll-lit effect ----------
  const litTargets = [];
  document.querySelectorAll('.words').forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(part);
            } else {
              const w = document.createElement('span');
              w.className = 'w';
              w.textContent = part;
              frag.append(w);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          child.classList.add('w');
        }
      });
    };
    walk(el);
    litTargets.push(el);
  });

  // ---------- Scroll reveals ----------
  document.querySelectorAll('.chips').forEach((list) => {
    [...list.children].forEach((chip, i) => chip.style.setProperty('--i', i));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('.count').forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .chips').forEach((el) => io.observe(el));

  // ---------- Counters ----------
  function countUp(el) {
    const to = Number(el.dataset.to);
    if (reduceMotion) { el.textContent = to; return; }
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(to * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- Scroll: progress bar, nav hide, word lighting, active link ----------
  const progress = document.querySelector('.progress');
  const navWrap = document.querySelector('.nav-wrap');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    const navOpen = document.querySelector('.nav.open');
    navWrap.classList.toggle('hidden', !navOpen && y > lastY && y > 300);
    lastY = y;

    litTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const words = el.querySelectorAll('.w');
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < lit));
    });

    let current = -1;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
    });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === current));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // ---------- Theme toggle ----------
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let accentRgb = '';
  const readAccent = () => {
    accentRgb = getComputedStyle(root).getPropertyValue('--accent-rgb').trim();
  };
  readAccent();
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    themeMeta.content = next === 'light' ? '#F6F5F0' : '#0A0B10';
    try { localStorage.setItem('theme', next); } catch (e) {}
    readAccent();
  });

  // ---------- Mobile nav ----------
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  if (reduceMotion) return;

  // ---------- Custom cursor ----------
  if (finePointer) {
    const ring = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      root.classList.add('has-cursor');
    });
    document.addEventListener('mouseleave', () => root.classList.remove('has-cursor'));
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .chip, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    // ---------- Magnetic buttons ----------
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    // ---------- 3D tilt + spotlight on cards ----------
    document.querySelectorAll('.tilt').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ---------- Hero particle constellation ----------
  const canvas = document.querySelector('.hero-canvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let w, h, points = [];
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.floor((w * h) / 16000), 90);
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

  const draw = () => {
    requestAnimationFrame(draw);
    if (!heroVisible) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        p.x += (dx / d) * 1.2;
        p.y += (dy / d) * 1.2;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${accentRgb}, ${0.14 * (1 - d / 130)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${accentRgb}, .5)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  draw();
})();
