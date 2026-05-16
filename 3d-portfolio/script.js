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

  /* ── Scene lighting (makes planets look 3D/real) ── */
  const ambientLight = new THREE.AmbientLight(0x223355, 0.5);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xfff5dd, 2.0);
  sunLight.position.set(45, 25, 70);
  scene.add(sunLight);
  const rimLight = new THREE.DirectionalLight(0x334477, 0.4);
  rimLight.position.set(-40, -10, -50);
  scene.add(rimLight);

  /* ── Planets ── */
  function buildEarth(x, y, z, radius) {
    const g = new THREE.Group();

    // Ocean base — Phong for realistic shading
    const oceanGeo = new THREE.SphereGeometry(radius, 32, 32);
    const oceanMat = new THREE.MeshPhongMaterial({ color: 0x1a6faa, shininess: 80, specular: 0x224466 });
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
    const cMat = new THREE.MeshPhongMaterial({ color: 0x2d8a4e, shininess: 8 });
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
    const iceMat = new THREE.MeshPhongMaterial({ color: 0xeef5ff, shininess: 60, transparent: true, opacity: 0.88 });
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
    const mat = new THREE.MeshPhongMaterial({ color, shininess: 22, specular: 0x222222 });
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
      const rGeo = new THREE.RingGeometry(radius * 1.35, radius * 2.25, 80);
      const rMat = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.52, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI * 0.22;
      g.add(ring);
      // Inner darker band
      const r2Geo = new THREE.RingGeometry(radius * 1.55, radius * 1.75, 80);
      const r2Mat = new THREE.MeshBasicMaterial({ color: 0x8a6a2a, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const ring2 = new THREE.Mesh(r2Geo, r2Mat);
      ring2.rotation.x = Math.PI * 0.22;
      g.add(ring2);
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

  /* ── Build spaceship — realistic multi-section design ── */
  function buildShip(scale) {
    const g = new THREE.Group();

    const hullMat    = new THREE.MeshBasicMaterial({ color: 0x7799cc, transparent: true, opacity: 0.92 });
    const hull2Mat   = new THREE.MeshBasicMaterial({ color: 0x5577aa, transparent: true, opacity: 0.90 });
    const wingMat    = new THREE.MeshBasicMaterial({ color: 0x6688bb, transparent: true, opacity: 0.88, side: THREE.DoubleSide });
    const accentMat  = new THREE.MeshBasicMaterial({ color: 0xe94560, transparent: true, opacity: 0.90, side: THREE.DoubleSide });
    const darkMat    = new THREE.MeshBasicMaterial({ color: 0x223355, transparent: true, opacity: 0.92 });
    const noseMat    = new THREE.MeshBasicMaterial({ color: 0xe94560, transparent: true, opacity: 0.95 });
    const cockpitMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.55 });
    const panelMat   = new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.65 });

    // ── FUSELAGE (3 sections) ──
    const fwdGeo = new THREE.CylinderGeometry(0.16, 0.36, 2.2, 12);
    const fwd = new THREE.Mesh(fwdGeo, hullMat);
    fwd.rotation.x = Math.PI / 2; fwd.position.z = 1.3;
    g.add(fwd);

    const midGeo = new THREE.CylinderGeometry(0.36, 0.40, 1.0, 12);
    const mid = new THREE.Mesh(midGeo, hull2Mat);
    mid.rotation.x = Math.PI / 2;
    g.add(mid);

    const aftGeo = new THREE.CylinderGeometry(0.40, 0.52, 1.2, 12);
    const aft = new THREE.Mesh(aftGeo, hull2Mat);
    aft.rotation.x = Math.PI / 2; aft.position.z = -1.1;
    g.add(aft);

    const tailGeo = new THREE.CylinderGeometry(0.52, 0.48, 0.5, 12);
    const tail = new THREE.Mesh(tailGeo, darkMat);
    tail.rotation.x = Math.PI / 2; tail.position.z = -1.85;
    g.add(tail);

    // ── NOSE CONE ──
    const noseGeo = new THREE.ConeGeometry(0.16, 2.8, 12);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = -Math.PI / 2; nose.position.z = 3.8;
    g.add(nose);

    // ── COCKPIT CANOPY ──
    const canopyGeo = new THREE.SphereGeometry(0.20, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const canopy = new THREE.Mesh(canopyGeo, cockpitMat);
    canopy.position.set(0, 0.36, 1.1);
    canopy.scale.set(1.4, 1.0, 2.0);
    g.add(canopy);

    // ── DELTA WINGS ──
    const mkWing = (xSign) => {
      const wGeo = new THREE.BoxGeometry(2.9, 0.05, 2.0);
      const w = new THREE.Mesh(wGeo, wingMat);
      w.position.set(xSign * 1.65, -0.04, -0.4);
      w.rotation.y = xSign * 0.30;
      w.rotation.z = xSign * -0.05;
      g.add(w);
      // Leading edge red stripe
      const leGeo = new THREE.BoxGeometry(2.7, 0.055, 0.14);
      const le = new THREE.Mesh(leGeo, accentMat);
      le.position.set(xSign * 1.60, -0.04, 0.5);
      le.rotation.y = xSign * 0.30;
      g.add(le);
    };
    mkWing(-1); mkWing(1);

    // ── VERTICAL FIN ──
    const finGeo = new THREE.BoxGeometry(0.055, 1.15, 1.5);
    const fin = new THREE.Mesh(finGeo, wingMat);
    fin.position.set(0, 0.72, -0.7);
    g.add(fin);

    // ── TWIN ENGINE PODS ──
    [-0.40, 0.40].forEach((xOff, idx) => {
      const podGeo = new THREE.CylinderGeometry(0.11, 0.14, 1.5, 8);
      const pod = new THREE.Mesh(podGeo, darkMat);
      pod.rotation.x = Math.PI / 2; pod.position.set(xOff, -0.30, -1.55);
      g.add(pod);

      const nozzleGeo = new THREE.ConeGeometry(0.14, 0.38, 8);
      const nozzle = new THREE.Mesh(nozzleGeo, darkMat);
      nozzle.rotation.x = Math.PI / 2; nozzle.position.set(xOff, -0.30, -2.42);
      g.add(nozzle);

      const eMat = new THREE.MeshBasicMaterial({ color: 0xff8833, transparent: true, opacity: 0.95 });
      const engine = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), eMat);
      engine.position.set(xOff, -0.30, -2.58);
      g.add(engine);

      const haloMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.22 });
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.30, 8, 6), haloMat);
      halo.position.set(xOff, -0.30, -2.58);
      g.add(halo);

      if (idx === 0) { g.userData.engine = engine; g.userData.halo = halo; }
      else           { g.userData.engineR = engine; g.userData.haloR = halo; }
    });

    // ── HULL DETAIL LINES ──
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 3.6), panelMat);
    spine.position.set(0, 0.38, 0.3);
    g.add(spine);

    [-0.30, 0.30].forEach(x => {
      const pl = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 2.8), panelMat);
      pl.position.set(x, 0.20, 0.4);
      g.add(pl);
    });

    g.scale.set(scale, scale, scale);
    return g;
  }

  /* ── World-space exhaust trail ── */
  function createTrail(color, maxLen) {
    const pos  = new Float32Array(maxLen * 3);
    const geo  = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setDrawRange(0, 0);
    const pts = new THREE.Points(geo,
      new THREE.PointsMaterial({ color, size: 0.38, transparent: true, opacity: 0.70, sizeAttenuation: true }));
    scene.add(pts);

    // Sparse fading tail (every other point, dimmer)
    const half = Math.floor(maxLen / 2);
    const pos2 = new Float32Array(half * 3);
    const geo2 = new THREE.BufferGeometry();
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    geo2.setDrawRange(0, 0);
    const pts2 = new THREE.Points(geo2,
      new THREE.PointsMaterial({ color, size: 0.18, transparent: true, opacity: 0.28, sizeAttenuation: true }));
    scene.add(pts2);

    const history = [];
    const tmp = new THREE.Vector3();
    return {
      update(engineMesh) {
        engineMesh.getWorldPosition(tmp);
        history.unshift({ x: tmp.x, y: tmp.y, z: tmp.z });
        if (history.length > maxLen) history.pop();
        const len = history.length;
        for (let i = 0; i < len; i++) {
          pos[i * 3] = history[i].x; pos[i * 3 + 1] = history[i].y; pos[i * 3 + 2] = history[i].z;
        }
        geo.setDrawRange(0, len);
        geo.attributes.position.needsUpdate = true;
        const h2 = Math.min(Math.floor(len / 2), half);
        for (let i = 0; i < h2; i++) {
          const idx = Math.min(i * 2 + 5, len - 1);
          pos2[i * 3] = history[idx].x; pos2[i * 3 + 1] = history[idx].y; pos2[i * 3 + 2] = history[idx].z;
        }
        geo2.setDrawRange(0, h2);
        geo2.attributes.position.needsUpdate = true;
      }
    };
  }

  /* ── Main ship ── */
  const mainShip = buildShip(2.4);
  scene.add(mainShip);
  const mainTrail = createTrail(0xff9944, 55);

  /* ── Background fleet ── */
  const fleet = [
    { mesh: buildShip(0.9),  R: 36, speed: 0.10, tilt:  0.5, phase: 1.1 },
    { mesh: buildShip(0.65), R: 28, speed: 0.14, tilt: -0.7, phase: 3.7 },
    { mesh: buildShip(0.5),  R: 44, speed: 0.08, tilt:  0.9, phase: 5.3 },
  ];
  fleet.forEach(s => scene.add(s.mesh));
  const fleetTrails = fleet.map(() => createTrail(0xff7733, 30));

  /* ── Moon + Moon→Earth trajectory ship ── */
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3.8, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0xb2b2c8, shininess: 6 })
  );
  moonMesh.position.set(-46, 28, -83);
  scene.add(moonMesh);

  // Add craters on moon
  [{ x:  1.5, y:  2.5, z:  3.2 }, { x: -2.0, y:  1.0, z:  3.1 }, { x:  0.5, y: -2.2, z:  3.2 }].forEach(p => {
    const c = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 8, 8),
      new THREE.MeshPhongMaterial({ color: 0x8888a0, shininess: 3 })
    );
    c.position.set(p.x, p.y, p.z);
    c.scale.set(1, 1, 0.25);
    moonMesh.add(c);
  });

  // Bezier control points
  const moonP  = new THREE.Vector3(-46, 28, -83);
  const earthP = new THREE.Vector3(-62, 38, -95);
  const arcP   = new THREE.Vector3(  2, 68, -76); // high arc midpoint

  function bezierVec3(u, p0, p1, p2) {
    const v = 1 - u;
    return new THREE.Vector3(
      v*v*p0.x + 2*v*u*p1.x + u*u*p2.x,
      v*v*p0.y + 2*v*u*p1.y + u*u*p2.y,
      v*v*p0.z + 2*v*u*p1.z + u*u*p2.z
    );
  }

  const pathShip  = buildShip(1.1);
  scene.add(pathShip);
  const pathTrail = createTrail(0xffaa44, 40);
  const PATH_CYCLE = 4.5; // t-units per full cycle (~10 s at t+=0.007 @60fps)

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
    t += 0.007;

    mSmooth.x += (mouse.x * 4 - mSmooth.x) * 0.05;
    mSmooth.y += (mouse.y * 2 - mSmooth.y) * 0.05;

    stars.rotation.y = t * 0.03 + mSmooth.x * 0.05;
    stars.rotation.x = t * 0.012 + mSmooth.y * 0.025;

    earth.rotation.y     = t * 0.04;
    redPlanet.rotation.y = t * 0.06;
    gasPlanet.rotation.y = t * 0.025;
    moonMesh.rotation.y  = t * 0.015;

    // Moon→Earth path ship (quadratic bezier trajectory)
    const pathFrac = (t % PATH_CYCLE) / PATH_CYCLE; // 0→1 per cycle
    if (pathFrac < 0.58) {
      const u = pathFrac / 0.58;
      const pos  = bezierVec3(u, moonP, arcP, earthP);
      const look = bezierVec3(Math.min(u + 0.025, 1), moonP, arcP, earthP);
      pathShip.position.copy(pos);
      pathShip.lookAt(look);
      pathShip.visible = true;
      pathTrail.update(pathShip.userData.engine);
      if (pathShip.userData.engine) {
        pathShip.userData.engine.material.opacity = 0.7 + Math.sin(t * 14) * 0.3;
      }
    } else if (pathFrac < 0.72) {
      pathShip.visible = true; // pause at Earth
    } else {
      pathShip.visible = false; // reset invisibly
    }

    // Main ship
    placeShip(mainShip, 20, 0.22, 0.0, 0, t);
    mainTrail.update(mainShip.userData.engine);
    if (mainShip.userData.engine) {
      const pulse = 0.70 + Math.sin(t * 14) * 0.30;
      const haloScale = 0.8 + Math.sin(t * 10) * 0.25;
      mainShip.userData.engine.material.opacity  = pulse;
      mainShip.userData.engineR.material.opacity = pulse;
      if (mainShip.userData.halo)  { mainShip.userData.halo.material.opacity  = pulse * 0.38; mainShip.userData.halo.scale.setScalar(haloScale); }
      if (mainShip.userData.haloR) { mainShip.userData.haloR.material.opacity = pulse * 0.38; mainShip.userData.haloR.scale.setScalar(haloScale); }
    }

    // Fleet
    fleet.forEach((s, i) => {
      placeShip(s.mesh, s.R, s.speed, s.tilt, s.phase, t);
      fleetTrails[i].update(s.mesh.userData.engine);
      if (s.mesh.userData.engine) {
        const p = 0.65 + Math.sin(t * 10 + s.phase) * 0.28;
        s.mesh.userData.engine.material.opacity  = p;
        if (s.mesh.userData.engineR) s.mesh.userData.engineR.material.opacity = p;
        if (s.mesh.userData.halo)    s.mesh.userData.halo.material.opacity    = p * 0.35;
        if (s.mesh.userData.haloR)   s.mesh.userData.haloR.material.opacity   = p * 0.35;
      }
    });

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
