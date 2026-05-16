/* ── THREE.JS HERO BACKGROUND ─────────────────────────────────────── */
(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 50;

  /* ── Particle field ── */
  const COUNT = 3000;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0x7b5ea7,
    size: 0.35,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ── Floating wireframe rings ── */
  const rings = [];
  const ringData = [
    { r: 14, tube: 0.06, color: 0xe94560, x: -20, y: 10, z: -10 },
    { r: 9,  tube: 0.04, color: 0x7b5ea7, x: 22,  y: -8, z: -20 },
    { r: 6,  tube: 0.04, color: 0xe94560, x: 5,   y: 16, z: -30 },
  ];

  ringData.forEach(d => {
    const g = new THREE.TorusGeometry(d.r, d.tube, 16, 80);
    const m = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, transparent: true, opacity: 0.25 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(d.x, d.y, d.z);
    scene.add(mesh);
    rings.push(mesh);
  });

  /* ── Floating icosahedra ── */
  const floaters = [];
  const floaterPositions = [
    [-25, -12, -15], [28, 14, -25], [-10, 20, -35], [18, -18, -10],
  ];

  floaterPositions.forEach(([x, y, z]) => {
    const g = new THREE.IcosahedronGeometry(1.4, 0);
    const m = new THREE.MeshBasicMaterial({ color: 0x7b5ea7, wireframe: true, transparent: true, opacity: 0.2 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    floaters.push(mesh);
  });

  /* ── Mouse parallax ── */
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Animation loop ── */
  let clock = 0;

  function animate() {
    requestAnimationFrame(animate);
    clock += 0.006;

    target.x += (mouse.x * 4 - target.x) * 0.05;
    target.y += (mouse.y * 2 - target.y) * 0.05;

    particles.rotation.y = clock * 0.04 + target.x * 0.06;
    particles.rotation.x = clock * 0.02 + target.y * 0.03;

    rings.forEach((r, i) => {
      r.rotation.x = clock * (0.18 + i * 0.07);
      r.rotation.y = clock * (0.12 + i * 0.05);
    });

    floaters.forEach((f, i) => {
      f.rotation.x += 0.008 + i * 0.003;
      f.rotation.y += 0.006 + i * 0.002;
      f.position.y += Math.sin(clock + i * 1.2) * 0.008;
    });

    camera.position.x += (target.x * 2 - camera.position.x) * 0.04;
    camera.position.y += (target.y * 1.5 - camera.position.y) * 0.04;

    renderer.render(scene, camera);
  }

  animate();
})();

/* ── NAVBAR ────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
});

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + window.innerHeight * 0.35;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
}

/* ── SMOOTH NAV CLOSE ON LINK CLICK ───────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── REVEAL ON SCROLL ──────────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.dataset.delay = (i % 5) * 80;
  revealObserver.observe(el);
});

/* ── 3D TILT ON CARDS ──────────────────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  const INTENSITY = 12;
  let rect;

  card.addEventListener('mouseenter', () => {
    rect = card.getBoundingClientRect();
  });

  card.addEventListener('mousemove', e => {
    if (!rect) rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * INTENSITY}deg) rotateX(${-dy * INTENSITY}deg) scale3d(1.02,1.02,1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ── ABOUT CARD MOUSE TILT ─────────────────────────────────────────── */
const aboutCard = document.getElementById('about-card');
if (aboutCard) {
  const wrap = aboutCard.parentElement;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    aboutCard.style.transform = `perspective(900px) rotateY(${dx * 14}deg) rotateX(${-dy * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    aboutCard.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    aboutCard.style.transition = 'transform 0.6s ease';
    setTimeout(() => aboutCard.style.transition = '', 600);
  });
}
