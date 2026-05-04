'use client';

import { useEffect } from 'react';
import * as THREE from 'three';

// Full port of `_reference/portfolio/companion.js` (221 LOC) to a React
// effect-mounted Three.js scene. Why not R3F: the Wanderer lives inside a
// fixed-position `#companion` host, not a bounded canvas — the parallax +
// pose choreography is driven by document-level scroll + `[data-companion-pose]`
// section geometry. A direct `useEffect` port is a much cleaner read than
// wrapping the whole document scroll loop in R3F primitives, and the scene is
// single-instance so we don't need framework-managed declarative scenes.
//
// Design invariants:
//   - bails out to the SVG fallback if `prefers-reduced-motion`,
//     `[data-motion="off"]`, or WebGL context creation throws
//   - canvas sits inside `#companion` (the Wanderer server component
//     ships the host div + fallback SVG)
//   - eight POSES drive per-section placement; lerp toward target each
//     frame via `damp = 1 - exp(-dt * 3.2)`
//   - section visibility + scroll progress select the pose; scroll velocity
//     only adds bounded secondary motion
//   - MutationObserver on `<html>` resyncs the accent hex on theme swap

export type Pose = {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
  scale: number;
  flap: number;
  spin: number;
};

export const POSES: Record<string, Pose> = {
  hero: {
    x: 0.55,
    y: 0.15,
    z: 0,
    rotY: 0.3,
    rotX: -0.1,
    scale: 1.0,
    flap: 0.35,
    spin: 0.08,
  },
  work: {
    x: 0.42,
    y: 0.08,
    z: 0.5,
    rotY: -0.5,
    rotX: 0.0,
    scale: 0.82,
    flap: 0.55,
    spin: 0.15,
  },
  about: {
    x: 0.65,
    y: -0.05,
    z: 0.8,
    rotY: -1.2,
    rotX: 0.1,
    scale: 0.85,
    flap: 0.15,
    spin: 0.03,
  },
  writing: {
    x: -0.4,
    y: 0.25,
    z: 1.0,
    rotY: 0.9,
    rotX: -0.2,
    scale: 0.75,
    flap: 0.75,
    spin: 0.25,
  },
  services: {
    x: 0.0,
    y: -0.2,
    z: -0.5,
    rotY: 0.0,
    rotX: 0.15,
    scale: 1.1,
    flap: 0.45,
    spin: 0.12,
  },
  process: {
    x: 0.6,
    y: 0.1,
    z: 0,
    rotY: -0.4,
    rotX: -0.3,
    scale: 0.95,
    flap: 0.25,
    spin: 0.06,
  },
  open: {
    x: -0.55,
    y: -0.1,
    z: 0.3,
    rotY: 0.6,
    rotX: 0.0,
    scale: 0.9,
    flap: 0.5,
    spin: 0.14,
  },
  contact: {
    x: 0.35,
    y: -0.35,
    z: 1.2,
    rotY: 0.0,
    rotX: -0.15,
    scale: 0.7,
    flap: 0.2,
    spin: 0.05,
  },
};

const ACCENT_MAP: Record<string, number> = {
  forest: 0x3a5a45,
  terracotta: 0xc26a3a,
  ochre: 0xb88b2a,
  ink: 0x2a2a2a,
};

type Crane = {
  group: THREE.Group;
  wingL: THREE.Group;
  wingR: THREE.Group;
  accent: THREE.MeshStandardMaterial;
  dispose: () => void;
};

export type PoseSectionBox = {
  key: string;
  top: number;
  bottom: number;
  height: number;
};

export type CranePoseTarget = {
  activeKey: string;
  pose: Pose;
  progress: number;
  topReset: boolean;
};

const TOP_RESET_Y = 48;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function normalizeScrollVelocity(deltaY: number): number {
  return clamp(deltaY * 0.003, -0.42, 0.42);
}

function clonePose(pose: Pose): Pose {
  return { ...pose };
}

function mixPose(a: Pose, b: Pose, amount: number): Pose {
  return {
    x: lerp(a.x, b.x, amount),
    y: lerp(a.y, b.y, amount),
    z: lerp(a.z, b.z, amount),
    rotY: lerp(a.rotY, b.rotY, amount),
    rotX: lerp(a.rotX, b.rotX, amount),
    scale: lerp(a.scale, b.scale, amount),
    flap: lerp(a.flap, b.flap, amount),
    spin: lerp(a.spin, b.spin, amount),
  };
}

function adaptPoseToViewport(
  pose: Pose,
  viewportWidth: number,
  viewportHeight: number,
): Pose {
  const mobile = viewportWidth < 700;
  const tablet = !mobile && viewportWidth < 940;
  const xScale = mobile ? 0.9 : tablet ? 0.78 : 1;
  const yScale = mobile ? 0.76 : tablet ? 0.88 : 1;
  const objectScale = mobile ? 0.46 : tablet ? 0.82 : 1;
  const lowerMobileOffset = mobile && viewportHeight < 760 ? -0.04 : 0;

  return {
    ...pose,
    x: pose.x * xScale,
    y: pose.y * yScale + lowerMobileOffset,
    z: pose.z + (mobile ? 0.18 : 0),
    scale: pose.scale * objectScale,
    flap: clamp(pose.flap * (mobile ? 0.9 : 1) + (mobile ? 0.04 : 0), 0, 0.9),
    spin: pose.spin * (mobile ? 0.75 : 1),
  };
}

type ScoredSection = PoseSectionBox & {
  progress: number;
  score: number;
  topAlignment: number;
  visibility: number;
};

function scoreSection(
  section: PoseSectionBox,
  viewportHeight: number,
  anchorY: number,
): ScoredSection {
  const visiblePx = clamp(
    Math.min(section.bottom, viewportHeight) - Math.max(section.top, 0),
    0,
    Math.min(section.height, viewportHeight),
  );
  const visibility = visiblePx / Math.max(1, Math.min(section.height, viewportHeight));
  const topAlignment = 1 - clamp(Math.abs(section.top - anchorY) / (viewportHeight * 0.55), 0, 1);
  const containsAnchor = section.top <= anchorY && section.bottom >= anchorY;
  const progress = clamp(
    (anchorY - section.top) / Math.max(1, section.height),
    0,
    1,
  );
  const score = visibility * 1.2 + topAlignment * 1.6 + (containsAnchor ? 0.9 : 0);

  return {
    ...section,
    progress,
    score,
    topAlignment,
    visibility,
  };
}

function applyProgressDrift(pose: Pose, section: ScoredSection): Pose {
  if (section.topAlignment > 0.82) return pose;

  const drift = (section.progress - 0.5) * (1 - section.topAlignment);
  return {
    ...pose,
    y: pose.y + drift * 0.12,
    z: pose.z + drift * 0.18,
    rotX: pose.rotX + drift * 0.16,
    rotY: pose.rotY + drift * 0.12,
  };
}

export function computeCranePoseTarget({
  sections,
  scrollY,
  viewportWidth,
  viewportHeight,
}: {
  sections: PoseSectionBox[];
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
}): CranePoseTarget {
  const heroPose = clonePose(POSES.hero as Pose);
  if (scrollY <= TOP_RESET_Y) {
    return {
      activeKey: 'hero',
      pose: adaptPoseToViewport({ ...heroPose, spin: 0 }, viewportWidth, viewportHeight),
      progress: 0,
      topReset: true,
    };
  }

  const anchorY = clamp(viewportHeight * 0.14, 72, 136);
  const scored = sections
    .filter((section) => POSES[section.key])
    .map((section) => scoreSection(section, viewportHeight, anchorY))
    .sort((a, b) => b.score - a.score);

  const active = scored[0];
  if (!active) {
    return {
      activeKey: 'hero',
      pose: adaptPoseToViewport(heroPose, viewportWidth, viewportHeight),
      progress: 0,
      topReset: false,
    };
  }

  const base = adaptPoseToViewport(
    applyProgressDrift(clonePose(POSES[active.key] as Pose), active),
    viewportWidth,
    viewportHeight,
  );
  const neighbor = scored.find(
    (section) => section.key !== active.key && section.visibility > 0.12,
  );
  const blend =
    neighbor && active.topAlignment < 0.45
      ? clamp(neighbor.visibility * (0.45 - active.topAlignment), 0, 0.22)
      : 0;
  const pose = neighbor
    ? mixPose(
        base,
        adaptPoseToViewport(clonePose(POSES[neighbor.key] as Pose), viewportWidth, viewportHeight),
        blend,
      )
    : base;

  return {
    activeKey: active.key,
    pose,
    progress: active.progress,
    topReset: false,
  };
}

function buildCrane(): Crane {
  const group = new THREE.Group();

  const paper = new THREE.MeshStandardMaterial({
    color: 0xf5ece0,
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const fold = new THREE.MeshStandardMaterial({
    color: 0xe8dcc8,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0x3a5a45,
    roughness: 0.8,
    metalness: 0.0,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const bodyGeo = new THREE.OctahedronGeometry(0.55, 0);
  const body = new THREE.Mesh(bodyGeo, paper);
  body.scale.set(0.6, 0.55, 1.4);
  group.add(body);

  const headGeo = new THREE.OctahedronGeometry(0.22, 0);
  const head = new THREE.Mesh(headGeo, paper);
  head.position.set(0, 0.22, 0.85);
  head.scale.set(0.9, 0.9, 1.2);
  group.add(head);

  const beakGeo = new THREE.ConeGeometry(0.08, 0.3, 4);
  const beak = new THREE.Mesh(beakGeo, accent);
  beak.position.set(0, 0.22, 1.15);
  beak.rotation.x = Math.PI / 2;
  group.add(beak);

  const tailGeom = new THREE.BufferGeometry();
  tailGeom.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [0, 0.05, -0.5, 0.15, -0.05, -1.3, -0.15, -0.05, -1.3],
      3,
    ),
  );
  tailGeom.computeVertexNormals();
  const tail = new THREE.Mesh(tailGeom, fold);
  group.add(tail);

  function wing(sign: 1 | -1): THREE.Group {
    const w = new THREE.Group();
    const g1 = new THREE.BufferGeometry();
    g1.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [0, 0, 0, sign * 1.4, 0.6, -0.2, sign * 0.9, 0.1, 0.6],
        3,
      ),
    );
    g1.computeVertexNormals();
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [0, 0, 0, sign * 0.9, 0.1, 0.6, sign * 0.8, -0.1, -0.5],
        3,
      ),
    );
    g2.computeVertexNormals();
    w.add(new THREE.Mesh(g1, paper));
    w.add(new THREE.Mesh(g2, fold));
    w.position.set(0, 0.1, 0);
    return w;
  }
  const wingL = wing(-1);
  group.add(wingL);
  const wingR = wing(1);
  group.add(wingR);

  const dispose = () => {
    bodyGeo.dispose();
    headGeo.dispose();
    beakGeo.dispose();
    tailGeom.dispose();
    wingL.children.forEach((m) => {
      if (m instanceof THREE.Mesh) m.geometry.dispose();
    });
    wingR.children.forEach((m) => {
      if (m instanceof THREE.Mesh) m.geometry.dispose();
    });
    paper.dispose();
    fold.dispose();
    accent.dispose();
  };

  return { group, wingL, wingR, accent, dispose };
}

function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

export default function WandererCrane() {
  useEffect(() => {
    const host = document.getElementById('companion');
    if (!host) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionTweak = document.documentElement.getAttribute('data-motion') !== 'off';
    if (reduceMotion || !motionTweak) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      host.removeChild(canvas);
      return;
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
    const ambient = new THREE.AmbientLight(0xfff6e8, 0.45);
    scene.add(ambient);

    const crane = buildCrane();
    scene.add(crane.group);

    const current: Pose = { ...(POSES.hero as Pose) };
    const target: Pose = { ...(POSES.hero as Pose) };
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-companion-pose]'),
    );

    const readSectionBoxes = (): PoseSectionBox[] =>
      sections.flatMap((section) => {
        const key = section.getAttribute('data-companion-pose');
        if (!key || !POSES[key]) return [];

        const rect = section.getBoundingClientRect();
        return [
          {
            key,
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
          },
        ];
      });

    const syncTarget = (): CranePoseTarget => {
      const model = computeCranePoseTarget({
        sections: readSectionBoxes(),
        scrollY: window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      Object.assign(target, model.pose);
      return model;
    };
    const initialTarget = syncTarget();
    if (initialTarget.topReset) Object.assign(current, target);

    const pointer = { x: 0, y: 0 };
    let lastScrollY = window.scrollY;
    let scrollVel = 0;

    const onScroll = () => {
      const nextScrollY = window.scrollY;
      scrollVel =
        nextScrollY <= TOP_RESET_Y
          ? 0
          : normalizeScrollVelocity(nextScrollY - lastScrollY);
      lastScrollY = nextScrollY;
    };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      syncTarget();
    };
    resize();
    window.addEventListener('resize', resize);

    const syncAccent = () => {
      const a = document.documentElement.getAttribute('data-accent') || 'forest';
      crane.accent.color.setHex(ACCENT_MAP[a] ?? ACCENT_MAP.forest!);
    };
    syncAccent();
    const mo = new MutationObserver(syncAccent);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-accent', 'data-mode'],
    });

    const clock = new THREE.Clock();
    let t = 0;
    let rafId = 0;

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      t += dt;
      const model = syncTarget();
      const mobile = window.innerWidth < 700;
      const damp = 1 - Math.exp(-dt * (model.topReset ? 7.5 : 3.6));
      if (model.topReset) scrollVel = 0;

      current.x = lerp(current.x, target.x, damp);
      current.y = lerp(current.y, target.y, damp);
      current.z = lerp(current.z, target.z, damp);
      current.rotY = lerp(current.rotY, target.rotY, damp);
      current.rotX = lerp(current.rotX, target.rotX, damp);
      current.scale = lerp(current.scale, target.scale, damp);
      current.flap = lerp(current.flap, target.flap, damp);
      current.spin = lerp(current.spin, target.spin, damp);

      const halfH = Math.tan(((camera.fov * Math.PI) / 180) / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const pointerX = mobile ? 0.07 : 0.25;
      const pointerY = mobile ? 0.05 : 0.15;
      const bob = mobile ? 0.045 : 0.08;
      crane.group.position.x = current.x * halfW + pointer.x * pointerX;
      crane.group.position.y =
        current.y * halfH + pointer.y * pointerY + Math.sin(t * 1.1) * bob;
      crane.group.position.z = current.z;

      const spinMotion = Math.sin(t * 0.8) * current.spin;
      crane.group.rotation.y =
        current.rotY + spinMotion + scrollVel * (mobile ? 1.1 : 1.8);
      crane.group.rotation.x = current.rotX + Math.sin(t * 0.7) * 0.06;
      crane.group.rotation.z =
        Math.sin(t * 0.9) * 0.04 - scrollVel * (mobile ? 0.55 : 0.9);

      const flapSpeed = 4 + current.flap * 10;
      const flapAmt = clamp(
        current.flap * 0.9 + Math.abs(scrollVel) * (mobile ? 0.8 : 1.1),
        0,
        1.15,
      );
      crane.wingL.rotation.z = Math.sin(t * flapSpeed) * flapAmt;
      crane.wingR.rotation.z = -Math.sin(t * flapSpeed) * flapAmt;

      crane.group.scale.setScalar(current.scale);
      scrollVel *= model.topReset ? 0 : 0.86;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    };

    // Warm-up render so the first visible frame has shaders compiled before
    // the SVG fallback is hidden. WebGL context creation above is already
    // guarded by try/catch — the correct failure mode for unavailable WebGL.
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);

    // When the canvas is mounted, hide the SVG fallback so both don't
    // composite. `companion-svg` is the CSS selector the Wanderer server
    // component uses for its fallback polygon.
    const svg = host.querySelector<SVGElement>('.companion-svg');
    if (svg) svg.style.display = 'none';

    return () => {
      cancelAnimationFrame(rafId);
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      crane.dispose();
      renderer.dispose();
      if (canvas.parentElement === host) host.removeChild(canvas);
      if (svg) svg.style.display = '';
    };
  }, []);

  return null;
}
