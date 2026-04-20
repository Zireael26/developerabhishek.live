// portfolio/companion.js
// The Wanderer — a persistent low-poly paper crane that reacts to scroll sections.
// Three.js via ESM CDN. Falls back to a static SVG if WebGL fails or reduced-motion is on.

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(function () {
  'use strict';

  const host = document.getElementById('companion');
  if (!host) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionTweak = document.body.getAttribute('data-motion') !== 'off';
  if (reduceMotion || !motionTweak) return showFallback();

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return showFallback();
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  const key = new THREE.DirectionalLight(0xfff0d8, 2.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9ab7a6, 0.9);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xfff6e8, 0.45));

  // --- low-poly crane (original, simpler build)
  function buildCrane() {
    const group = new THREE.Group();

    const paper = new THREE.MeshStandardMaterial({
      color: 0xf5ece0, roughness: 0.85, metalness: 0.0,
      side: THREE.DoubleSide, flatShading: true,
    });
    const fold = new THREE.MeshStandardMaterial({
      color: 0xe8dcc8, roughness: 0.9, metalness: 0.0,
      side: THREE.DoubleSide, flatShading: true,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x3a5a45, roughness: 0.8, metalness: 0.0,
      side: THREE.DoubleSide, flatShading: true,
    });

    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), paper);
    body.scale.set(0.6, 0.55, 1.4);
    group.add(body);

    const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), paper);
    head.position.set(0, 0.22, 0.85);
    head.scale.set(0.9, 0.9, 1.2);
    group.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), accent);
    beak.position.set(0, 0.22, 1.15);
    beak.rotation.x = Math.PI / 2;
    group.add(beak);

    const tailGeom = new THREE.BufferGeometry();
    tailGeom.setAttribute('position', new THREE.Float32BufferAttribute(
      [ 0, 0.05, -0.5,   0.15, -0.05, -1.3,   -0.15, -0.05, -1.3 ], 3
    ));
    tailGeom.computeVertexNormals();
    group.add(new THREE.Mesh(tailGeom, fold));

    function wing(sign) {
      const w = new THREE.Group();
      const g1 = new THREE.BufferGeometry();
      g1.setAttribute('position', new THREE.Float32BufferAttribute(
        [ 0, 0, 0,   sign * 1.4, 0.6, -0.2,   sign * 0.9, 0.1, 0.6 ], 3
      ));
      g1.computeVertexNormals();
      const g2 = new THREE.BufferGeometry();
      g2.setAttribute('position', new THREE.Float32BufferAttribute(
        [ 0, 0, 0,   sign * 0.9, 0.1, 0.6,   sign * 0.8, -0.1, -0.5 ], 3
      ));
      g2.computeVertexNormals();
      w.add(new THREE.Mesh(g1, paper));
      w.add(new THREE.Mesh(g2, fold));
      w.position.set(0, 0.1, 0);
      return w;
    }
    const wingL = wing(-1); group.add(wingL);
    const wingR = wing(1);  group.add(wingR);

    return { group, wingL, wingR, accent };
  }

  const crane = buildCrane();
  scene.add(crane.group);

  // --- poses: meaningful per-section destinations (original, clearer choreography)
  const POSES = {
    hero:     { x:  0.55, y:  0.15, z: 0,   rotY:  0.3,  rotX: -0.1, scale: 1.0, flap: 0.35, spin: 0.08 },
    work:     { x: -0.55, y:  0.0,  z: 0.5, rotY: -0.5,  rotX:  0.0, scale: 0.9, flap: 0.55, spin: 0.15 },
    about:    { x:  0.65, y: -0.05, z: 0.8, rotY: -1.2,  rotX:  0.1, scale: 0.85,flap: 0.15, spin: 0.03 },
    writing:  { x: -0.4,  y:  0.25, z: 1.0, rotY:  0.9,  rotX: -0.2, scale: 0.75,flap: 0.75, spin: 0.25 },
    services: { x:  0.0,  y: -0.2,  z: -0.5,rotY:  0.0,  rotX:  0.15,scale: 1.1, flap: 0.45, spin: 0.12 },
    process:  { x:  0.6,  y:  0.1,  z: 0,   rotY: -0.4,  rotX: -0.3, scale: 0.95,flap: 0.25, spin: 0.06 },
    open:     { x: -0.55, y: -0.1,  z: 0.3, rotY:  0.6,  rotX:  0.0, scale: 0.9, flap: 0.5,  spin: 0.14 },
    contact:  { x:  0.35, y: -0.35, z: 1.2, rotY:  0.0,  rotX: -0.15,scale: 0.7, flap: 0.2,  spin: 0.05 },
  };

  let current = { ...POSES.hero };
  const target = { ...POSES.hero };

  const sections = Array.from(document.querySelectorAll('[data-companion-pose]'));
  const observer = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach((e) => { if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e; });
    if (!best) return;
    const key = best.target.getAttribute('data-companion-pose');
    if (POSES[key]) Object.assign(target, POSES[key]);
  }, { threshold: [0.2, 0.45, 0.7] });
  sections.forEach((s) => observer.observe(s));

  let lastScrollY = window.scrollY;
  let scrollVel = 0;
  window.addEventListener('scroll', () => {
    scrollVel = (window.scrollY - lastScrollY) * 0.004;
    lastScrollY = window.scrollY;
  }, { passive: true });

  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const ACCENT_MAP = { forest: 0x3a5a45, terracotta: 0xc26a3a, ochre: 0xb88b2a, ink: 0x2a2a2a };
  function syncAccent() {
    const a = document.body.getAttribute('data-accent') || 'forest';
    crane.accent.color.setHex(ACCENT_MAP[a] || ACCENT_MAP.forest);
  }
  syncAccent();
  new MutationObserver(syncAccent).observe(document.body, { attributes: true, attributeFilter: ['data-accent', 'data-mode'] });

  const clock = new THREE.Clock();
  let t = 0;
  function lerp(a, b, k) { return a + (b - a) * k; }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    const damp = 1 - Math.exp(-dt * 3.2);

    current.x = lerp(current.x, target.x, damp);
    current.y = lerp(current.y, target.y, damp);
    current.z = lerp(current.z, target.z, damp);
    current.rotY = lerp(current.rotY, target.rotY, damp);
    current.rotX = lerp(current.rotX, target.rotX, damp);
    current.scale = lerp(current.scale, target.scale, damp);
    current.flap = lerp(current.flap, target.flap, damp);
    current.spin = lerp(current.spin, target.spin, damp);

    const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
    const halfW = halfH * camera.aspect;
    crane.group.position.x = current.x * halfW + pointer.x * 0.25;
    crane.group.position.y = current.y * halfH + pointer.y * 0.15 + Math.sin(t * 1.1) * 0.08;
    crane.group.position.z = current.z;

    crane.group.rotation.y = current.rotY + t * current.spin + scrollVel * 2.2;
    crane.group.rotation.x = current.rotX + Math.sin(t * 0.7) * 0.06;
    crane.group.rotation.z = Math.sin(t * 0.9) * 0.04 - scrollVel * 1.1;

    const flapSpeed = 4 + current.flap * 10;
    const flapAmt = current.flap * 0.9 + Math.abs(scrollVel) * 1.5;
    crane.wingL.rotation.z =  Math.sin(t * flapSpeed) * flapAmt;
    crane.wingR.rotation.z = -Math.sin(t * flapSpeed) * flapAmt;

    crane.group.scale.setScalar(current.scale);
    scrollVel *= 0.9;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  const bailT0 = performance.now();
  renderer.render(scene, camera);
  if (performance.now() - bailT0 > 80) {
    host.removeChild(canvas);
    renderer.dispose();
    return showFallback();
  }
  requestAnimationFrame(frame);

  function showFallback() {
    const host = document.getElementById('companion');
    if (!host) return;
    host.innerHTML = '<svg class="companion-svg" viewBox="0 0 120 80" aria-hidden="true">\
<polygon points="10,50 60,15 55,45 100,30 70,55 80,70 55,60 30,72" fill="#f5ece0" stroke="#2a2a2a" stroke-width="1.2" stroke-linejoin="round"/>\
<polygon points="55,45 100,30 70,55" fill="#e8dcc8"/>\
<polygon points="55,60 80,70 70,55" fill="#e8dcc8"/>\
<circle cx="60" cy="20" r="2" fill="#2a2a2a"/>\
</svg>';
  }
})();
