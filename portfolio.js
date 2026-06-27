const root = document.documentElement;
const dot = document.getElementById('dot');
const ring = document.getElementById('ring');
const spot = document.getElementById('spot');
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');

let w, h, dpr;
const mouse = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
const ringP = { x: mouse.x, y: mouse.y };
const spotP = { x: mouse.x, y: mouse.y };
const particles = [];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(innerWidth * dpr);
  h = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

function spawn(x, y) {
  for (let i = 0; i < 2; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      life: 1,
      size: Math.random() * 2.2 + 0.8,
      hue: Math.random() < 0.5 ? 190 : 270
    });
  }
  if (particles.length > 220) particles.splice(0, particles.length - 220);
}

window.addEventListener('pointermove', e => {
  mouse.tx = e.clientX;
  mouse.ty = e.clientY;
  root.style.setProperty('--mx', e.clientX + 'px');
  root.style.setProperty('--my', e.clientY + 'px');
  spawn(e.clientX, e.clientY);
}, { passive: true });

function draw() {
  mouse.x += (mouse.tx - mouse.x) * 0.18;
  mouse.y += (mouse.ty - mouse.y) * 0.18;
  ringP.x += (mouse.tx - ringP.x) * 0.09;
  ringP.y += (mouse.ty - ringP.y) * 0.09;
  spotP.x += (mouse.tx - spotP.x) * 0.05;
  spotP.y += (mouse.ty - spotP.y) * 0.05;

  dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
  ring.style.transform = `translate3d(${ringP.x}px, ${ringP.y}px, 0) translate(-50%, -50%)`;
  spot.style.transform = `translate3d(${spotP.x}px, ${spotP.y}px, 0) translate(-50%, -50%)`;

  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.life -= 0.015;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const a = Math.max(p.life, 0);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 9);
    g.addColorStop(0, `hsla(${p.hue},100%,70%,${a})`);
    g.addColorStop(.35, `hsla(${p.hue},100%,60%,${a * .42})`);
    g.addColorStop(1, `hsla(${p.hue},100%,55%,0)`);

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: .14 });
reveals.forEach(el => io.observe(el));

const parallax = document.querySelectorAll('.parallax');
window.addEventListener('pointermove', e => {
  const nx = (e.clientX / innerWidth - .5);
  const ny = (e.clientY / innerHeight - .5);
  parallax.forEach(card => {
    const d = Number(card.dataset.depth || 8);
    card.style.transform = `translate3d(${nx * d}px, ${ny * d}px, 0)`;
  });
}, { passive: true });

document.querySelectorAll('.tilt').forEach(card => {
  let r;
  const max = 12;

  card.addEventListener('mouseenter', () => {
    r = card.getBoundingClientRect();
  });

  card.addEventListener('mousemove', e => {
    r ||= card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * max;
    const ry = (x - 0.5) * max;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('.magnetic').forEach(btn => {
  const strength = 14;

  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate3d(${x / strength}px, ${y / strength}px, 0) scale(1.03)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

document.querySelectorAll('a, .tilt, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '54px';
    ring.style.height = '54px';
    spot.style.width = '140px';
    spot.style.height = '140px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px';
    ring.style.height = '36px';
    spot.style.width = '110px';
    spot.style.height = '110px';
  });
});