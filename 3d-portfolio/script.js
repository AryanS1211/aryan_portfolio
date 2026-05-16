/* ── THREE.JS HERO BACKGROUND ─────────────────────────────────────── */
(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.z = 50;

  /* ── Star field ── */
  const COUNT = 3500;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x9988cc, size: 0.32, transparent: true, opacity: 0.65 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ── Planets ── */
  function buildEarth(x, y, z, radius) {
    const g = new THREE.Group();

    // Ocean base
    const oceanGeo = new THREE.SphereGeometry(radius, 32, 32);
    const oceanMat = new THREE.MeshBasicMaterial({ color: 0x1a6faa });
    g.add(new THREE.Mesh(oceanGeo, oceanMat));

    // Atmosphere glow (slightly larger, transparent blue)
    const atmGeo = new THREE.SphereGeometry(radius * 1.06, 32, 32);
    const atmMat = new THREE.MeshBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.18, side: THREE.BackSide });
    g.add(new THREE.Mesh(atmGeo, atmMat));

    // Continents — green patches scattered on surface
    const continentData = [
      { lat:  0.5, lon:  0.3, sx: 0.38, sy: 0.18, sz: 0.10 },
      { lat: -0.4, lon:  1.4, sx: 0.30, sy: 0.14, sz: 0.10 },
      { lat:  0.9, lon: -1.0, sx: 0.22, sy: 0.12, sz: 0.10 },
      { lat: -0.7, lon:  2.8, sx: 0.42, sy: 0.20, sz: 0.10 },
      { lat:  0.2, lon: -2.2, sx: 0.26, sy: 0.14, sz: 0.10 },
      { lat:  1.1, lon:  2.0, sx: 0.20, sy: 0.10, sz: 0.10 },
    ];
    const cMat = new THREE.MeshBasicMaterial({ color: 0x2d8a4e });
    continentData.forEach(({ lat, lon, sx, sy }) => {
      const cGeo = new THREE.SphereGeometry(radius * 0.32, 8, 8);
      const c = new THREE.Mesh(cGeo, cMat);
      c.scale.set(sx, sy, 0.18);
      c.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
      );
      c.lookAt(0, 0, 0);
      g.add(c);
    });

    // Polar ice caps
    const iceMat = new THREE.MeshBasicMaterial({ color: 0xddeeff, transparent: true, opacity: 0.85 });
    [-1, 1].forEach(sign => {
      const iceGeo = new THREE.SphereGeometry(radius * 0.28, 8, 8);
      const ice = new THREE.Mesh(iceGeo, iceMat);
      ice.scale.set(1, 0.22, 1);
      ice.position.y = sign * radius * 0.92;
      g.add(ice);
    });

    // Thin wireframe grid (like globe lines)
    const gridGeo = new THREE.SphereGeometry(radius * 1.002, 16, 16);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x66aadd, wireframe: true, transparent: true, opacity: 0.07 });
    g.add(new THREE.Mesh(gridGeo, gridMat));

    g.position.set(x, y, z);
    return g;
  }

  function buildPlanet(x, y, z, radius, color, ringColor) {
    const g = new THREE.Group();
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const mat = new THREE.MeshBasicMaterial({ color });
    g.add(new THREE.Mesh(geo, mat));

    // Subtle surface variation
    const overlayGeo = new THREE.SphereGeometry(radius * 1.001, 12, 12);
    const overlayMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.04 });
    g.add(new THREE.Mesh(overlayGeo, overlayMat));

    // Atmosphere
    const atmGeo = new THREE.SphereGeometry(radius * 1.08, 24, 24);
    const atmMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.BackSide });
    g.add(new THREE.Mesh(atmGeo, atmMat));

    // Optional rings (Saturn-like)
    if (ringColor) {
      const rGeo = new THREE.TorusGeometry(radius * 1.85, radius * 0.28, 4, 64);
      const rMat = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI * 0.42;
      g.add(ring);
    }

    g.position.set(x, y, z);
    return g;
  }

  // Earth — top-left corner, far back
  const earth = buildEarth(-62, 38, -95, 11);
  scene.add(earth);

  // Rocky red planet — far right, mid-height
  const redPlanet = buildPlanet(72, -6, -75, 6.5, 0xb84a2f);
  scene.add(redPlanet);

  // Gas giant with rings — bottom area, deep background
  const gasPlanet = buildPlanet(28, -58, -115, 17, 0xc8a45a, 0xd4b87a);
  scene.add(gasPlanet);

  /* ── Build a spaceship from primitives ── */
  function buildShip(scale) {
    const g = new THREE.Group();

    const hullMat   = new THREE.MeshBasicMaterial({ color: 0x8aacff, transparent: true, opacity: 0.88 });
    const wingMat   = new THREE.MeshBasicMaterial({ color: 0x7b5ea7, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    const noseMat   = new THREE.MeshBasicMaterial({ color: 0xe94560, transparent: true, opacity: 0.95 });
    const wireMat   = new THREE.MeshBasicMaterial({ color: 0xbbddff, wireframe: true, transparent: true, opacity: 0.25 });
    const engineMat = new THREE.MeshBasicMaterial({ color: 0xff7744, transparent: true, opacity: 0.95 });

    // ── Body (cylinder aligned to +Z) ──
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.58, 3.2, 8);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.rotation.x = Math.PI / 2;
    g.add(body);

    const bodyWire = new THREE.Mesh(bodyGeo, wireMat);
    bodyWire.rotation.x = Math.PI / 2;
    g.add(bodyWire);

    // ── Nose cone — tip points +Z ──
    const noseGeo = new THREE.ConeGeometry(0.28, 2.0, 8);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 2.8;
    g.add(nose);

    // ── Wings (flat swept-back boxes) ──
    const wGeo = new THREE.BoxGeometry(2.6, 0.07, 1.5);

    const wL = new THREE.Mesh(wGeo, wingMat);
    wL.position.set(-1.55, 0, -0.4);
    wL.rotation.y = 0.22;
    g.add(wL);

    const wR = new THREE.Mesh(wGeo, wingMat);
    wR.position.set(1.55, 0, -0.4);
    wR.rotation.y = -0.22;
    g.add(wR);

    // ── Fin (vertical stabiliser) ──
    const finGeo = new THREE.BoxGeometry(0.07, 0.9, 1.2);
    const fin = new THREE.Mesh(finGeo, wingMat);
    fin.position.set(0, 0.55, -0.6);
    g.add(fin);

    // ── Engine glow orb ──
    const eGeo = new THREE.SphereGeometry(0.34, 8, 6);
    const engine = new THREE.Mesh(eGeo, engineMat);
    engine.position.z = -1.75;
    g.add(engine);
    g.userData.engine = engine;

    // ── Engine trail ──
    const trailColors = [0xff9944, 0xff7722, 0xff5511, 0xff3300, 0xcc2200, 0x991100, 0x550000];
    for (let i = 0; i < 7; i++) {
      const r = Math.max(0.02, 0.3 - i * 0.04);
      const tGeo = new THREE.SphereGeometry(r, 5, 5);
      const tMat = new THREE.MeshBasicMaterial({
        color: trailColors[i] || 0x330000,
        transparent: true,
        opacity: Math.max(0, 0.72 - i * 0.1)
      });
      const trail = new THREE.Mesh(tGeo, tMat);
      trail.position.z = -2.15 - i * 0.44;
      g.add(trail);
    }

    g.scale.set(scale, scale, scale);
    return g;
  }

  /* ── Main ship ── */
  const mainShip = buildShip(2.4);
  scene.add(mainShip);

  /* ── Background fleet ── */
  const fleet = [
    { mesh: buildShip(0.9), R: 36, speed: 0.10, tilt: 0.5,  phase: 1.1 },
    { mesh: buildShip(0.65), R: 28, speed: 0.14, tilt: -0.7, phase: 3.7 },
    { mesh: buildShip(0.5),  R: 44, speed: 0.08, tilt: 0.9,  phase: 5.3 },
  ];
  fleet.forEach(s => scene.add(s.mesh));

  /* ── Orbit helper ── */
  function orbitPos(angle, R, tilt) {
    return new THREE.Vector3(
      Math.cos(angle) * R,
      Math.sin(angle * 0.55) * R * 0.32 + Math.sin(tilt + angle * 0.28) * 5,
      Math.sin(angle) * R * 0.55 - 8
    );
  }

  function placeShip(ship, R, speed, tilt, phase, t) {
    const a = t * speed + phase;
    const pos  = orbitPos(a, R, tilt);
    const look = orbitPos(a + 0.06, R, tilt);
    ship.position.copy(pos);
    ship.lookAt(look);
    ship.rotateZ(Math.sin(a * 1.8) * 0.22);  // banking
  }

  /* ── Mouse parallax ── */
  const mouse  = { x: 0, y: 0 };
  const mSmooth = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Render loop ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.006;

    mSmooth.x += (mouse.x * 4 - mSmooth.x) * 0.05;
    mSmooth.y += (mouse.y * 2 - mSmooth.y) * 0.05;

    // Stars slowly drift with mouse
    stars.rotation.y = t * 0.03 + mSmooth.x * 0.05;
    stars.rotation.x = t * 0.012 + mSmooth.y * 0.025;

    // Planet rotation
    earth.rotation.y    = t * 0.04;
    redPlanet.rotation.y = t * 0.06;
    gasPlanet.rotation.y = t * 0.025;

    // Main ship orbit
    placeShip(mainShip, 20, 0.20, 0.0, 0, t);
    // Pulse engine glow
    if (mainShip.userData.engine) {
      mainShip.userData.engine.material.opacity = 0.72 + Math.sin(t * 9) * 0.22;
    }

    // Fleet
    fleet.forEach(s => {
      placeShip(s.mesh, s.R, s.speed, s.tilt, s.phase, t);
      if (s.mesh.userData.engine) {
        s.mesh.userData.engine.material.opacity = 0.65 + Math.sin(t * 7 + s.phase) * 0.2;
      }
    });

    // Camera parallax
    camera.position.x += (mSmooth.x * 2   - camera.position.x) * 0.04;
    camera.position.y += (mSmooth.y * 1.5  - camera.position.y) * 0.04;

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
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── REVEAL ON SCROLL ──────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      setTimeout(() => el.classList.add('visible'), el.dataset.delay || 0);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 5) * 80;
  revealObserver.observe(el);
});

/* ── 3D TILT ON CARDS ──────────────────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  let rect;
  card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', e => {
    if (!rect) rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ── ABOUT CARD TILT ───────────────────────────────────────────────── */
const aboutCard = document.getElementById('about-card');
if (aboutCard) {
  const wrap = aboutCard.parentElement;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    aboutCard.style.transform = `perspective(900px) rotateY(${dx * 14}deg) rotateX(${-dy * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    aboutCard.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    aboutCard.style.transition = 'transform 0.6s ease';
    setTimeout(() => aboutCard.style.transition = '', 600);
  });
}
