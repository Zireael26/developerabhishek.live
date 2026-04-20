'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Port of the vanilla Three.js scene at `_reference/portfolio/index.html:1583–1833`.
// 4 icosahedron nodes (orchestrator hub + reasoning / tools / memory
// satellites), line edges, packets travelling along edges, pointer
// parallax on the frame, theme + accent sync via MutationObserver on the
// html element. Kept in one file — the scene is small and the animation
// loop reads cleaner as a single unit than as a tangle of props.
//
// Design invariants:
//   - runs only client-side (loaded via next/dynamic ssr: false)
//   - `prefers-reduced-motion: reduce` + [data-motion="off"] are enforced
//     upstream by Hero.tsx; if either is set, this component is not
//     rendered at all and the SVG fallback stays visible.
//   - canvas carries aria-hidden so screen readers ignore the decoration.

type NodeDef = {
  label: string;
  pos: [number, number, number];
  size: number;
  hub?: boolean;
};

const NODE_DEFS: ReadonlyArray<NodeDef> = [
  { label: 'orchestrator', pos: [0, 0, 0], size: 0.46, hub: true },
  { label: 'reasoning', pos: [-1.85, 1.1, -0.3], size: 0.3 },
  { label: 'tools', pos: [1.9, 0.7, 0.2], size: 0.26 },
  { label: 'memory', pos: [0.1, -1.75, 0.1], size: 0.28 },
];

const EDGE_PAIRS: ReadonlyArray<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [3, 1],
];

type ColorRead = {
  accent: THREE.Color;
  ink: THREE.Color;
  bg: THREE.Color;
  satellite: THREE.Color;
  edge: THREE.Color;
};

function readColors(): ColorRead {
  if (typeof window === 'undefined') {
    return {
      accent: new THREE.Color('#13423D'),
      ink: new THREE.Color('#1A1A1E'),
      bg: new THREE.Color('#F5F1E8'),
      satellite: new THREE.Color('#13423D').lerp(new THREE.Color('#F5F1E8'), 0.35),
      edge: new THREE.Color('#1A1A1E').lerp(new THREE.Color('#F5F1E8'), 0.55),
    };
  }
  const cs = getComputedStyle(document.documentElement);
  const accent = new THREE.Color(cs.getPropertyValue('--accent').trim() || '#13423D');
  const ink = new THREE.Color(cs.getPropertyValue('--ink').trim() || '#1A1A1E');
  const bg = new THREE.Color(cs.getPropertyValue('--bg').trim() || '#F5F1E8');
  return {
    accent,
    ink,
    bg,
    satellite: accent.clone().lerp(bg, 0.35),
    edge: ink.clone().lerp(bg, 0.55),
  };
}

function makeLabelSprite(text: string, hexColor: string): THREE.Sprite {
  const fontPx = 40;
  const pad = 12;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('AgentGraph: no 2d canvas context');
  ctx.font = `500 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = fontPx + pad * 2;
  c.width = w;
  c.height = h;
  const ctx2 = c.getContext('2d');
  if (!ctx2) throw new Error('AgentGraph: no 2d canvas context (2)');
  ctx2.font = `500 ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'middle';
  ctx2.fillStyle = hexColor;
  ctx2.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.renderOrder = 10;
  const scaleFactor = 0.0022;
  sprite.scale.set(w * scaleFactor, h * scaleFactor, 1);
  return sprite;
}

type SceneRefs = {
  group: THREE.Group;
  nodes: Array<{
    def: NodeDef;
    mesh: THREE.Mesh<
      THREE.IcosahedronGeometry,
      THREE.MeshStandardMaterial
    >;
    ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
    label: THREE.Sprite;
    basePos: THREE.Vector3;
    labelYOff: number;
  }>;
  edges: Array<{
    pair: readonly [number, number];
    line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  }>;
  packets: Array<{
    pair: readonly [number, number];
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    t: number;
    speed: number;
    dir: 1 | -1;
  }>;
  packetMat: THREE.MeshBasicMaterial;
};

type PointerRef = React.MutableRefObject<{ tx: number; ty: number; x: number; y: number }>;

function Scene({ pointerRef }: { pointerRef: PointerRef }) {
  const [colors, setColors] = useState<ColorRead>(() => readColors());
  const { scene } = useThree();
  const refs = useRef<SceneRefs | null>(null);

  // Sync colors on theme/accent change. Runs client-side only (useEffect).
  useEffect(() => {
    const update = () => setColors(readColors());
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode', 'data-accent'],
    });
    return () => mo.disconnect();
  }, []);

  // Build the scene imperatively on mount. Re-runs if colors snapshot
  // identity changes (theme flip).
  useEffect(() => {
    const group = new THREE.Group();
    scene.add(group);

    // Nodes
    const nodes = NODE_DEFS.map((def) => {
      const geo = new THREE.IcosahedronGeometry(def.size, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: def.hub ? colors.accent : colors.satellite,
        roughness: 0.55,
        metalness: 0.1,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      group.add(mesh);

      const ringGeo = new THREE.RingGeometry(def.size * 1.55, def.size * 1.58, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(mesh.position);
      group.add(ring);

      const inkHex = '#' + colors.ink.getHexString();
      const label = makeLabelSprite(def.label, inkHex);
      const yOff = def.hub ? def.size + 0.32 : -(def.size + 0.28);
      label.position.set(def.pos[0], def.pos[1] + yOff, def.pos[2]);
      group.add(label);

      return { def, mesh, ring, label, basePos: mesh.position.clone(), labelYOff: yOff };
    });

    // Edges (thin lines, updated each frame to follow node positions)
    const edges = EDGE_PAIRS.map((pair) => {
      const a = nodes[pair[0]];
      const b = nodes[pair[1]];
      if (!a || !b) throw new Error(`AgentGraph: edge refers to missing node ${pair}`);
      const geom = new THREE.BufferGeometry().setFromPoints([
        a.basePos.clone(),
        b.basePos.clone(),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: colors.edge,
        transparent: true,
        opacity: 0.5,
      });
      const line = new THREE.Line(geom, mat);
      group.add(line);
      return { pair, line };
    });

    // Packets travelling along edges
    const packetGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: colors.accent });
    const packets = EDGE_PAIRS.map((pair, i) => {
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      group.add(mesh);
      return {
        pair,
        mesh,
        t: Math.random(),
        speed: 0.11 + Math.random() * 0.06,
        dir: (i % 2 ? 1 : -1) as 1 | -1,
      };
    });

    refs.current = { group, nodes, edges, packets, packetMat };

    return () => {
      nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        n.mesh.material.dispose();
        n.ring.geometry.dispose();
        n.ring.material.dispose();
        if (n.label.material.map) n.label.material.map.dispose();
        n.label.material.dispose();
      });
      edges.forEach((e) => {
        e.line.geometry.dispose();
        e.line.material.dispose();
      });
      packetGeo.dispose();
      packetMat.dispose();
      scene.remove(group);
      refs.current = null;
    };
  }, [scene, colors]);

  useFrame((state) => {
    const current = refs.current;
    if (!current) return;
    const t = state.clock.getElapsedTime();

    const p = pointerRef.current;
    p.x += (p.tx - p.x) * 0.06;
    p.y += (p.ty - p.y) * 0.06;
    current.group.rotation.y = p.x * 0.25 + Math.sin(t * 0.15) * 0.05;
    current.group.rotation.x = -p.y * 0.18 + Math.cos(t * 0.17) * 0.04;

    // Node bob + ring spin + label follow
    current.nodes.forEach((n, i) => {
      const base = n.basePos;
      n.mesh.position.set(
        base.x + Math.sin(t * 0.6 + i) * 0.04,
        base.y + Math.cos(t * 0.5 + i * 1.3) * 0.05,
        base.z + Math.sin(t * 0.4 + i * 2.1) * 0.03,
      );
      n.ring.position.copy(n.mesh.position);
      n.ring.rotation.x += 0.003;
      n.ring.rotation.y += 0.004;
      n.label.position.set(
        n.mesh.position.x,
        n.mesh.position.y + n.labelYOff,
        n.mesh.position.z,
      );
      n.mesh.rotation.y += 0.002;
    });

    // Edge endpoints
    current.edges.forEach((e) => {
      const posAttr = e.line.geometry.attributes.position as THREE.BufferAttribute;
      const nodeA = current.nodes[e.pair[0]];
      const nodeB = current.nodes[e.pair[1]];
      if (!nodeA || !nodeB) return;
      const pa = nodeA.mesh.position;
      const pb = nodeB.mesh.position;
      posAttr.setXYZ(0, pa.x, pa.y, pa.z);
      posAttr.setXYZ(1, pb.x, pb.y, pb.z);
      posAttr.needsUpdate = true;
    });

    // Packets slide between the two ends, wrap to other side.
    current.packets.forEach((pk) => {
      pk.t += pk.speed * pk.dir * 0.016;
      if (pk.t > 1) pk.t -= 1;
      if (pk.t < 0) pk.t += 1;
      const nodeA = current.nodes[pk.pair[0]];
      const nodeB = current.nodes[pk.pair[1]];
      if (!nodeA || !nodeB) return;
      pk.mesh.position.lerpVectors(nodeA.mesh.position, nodeB.mesh.position, pk.t);
    });
  });

  return null;
}

export default function AgentGraph() {
  // Frame-level pointer offset — useRef (not useMemo) so Scene's useFrame
  // callback can mutate it each frame without tripping the immutability
  // lint rule on hook arguments.
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  return (
    <div
      className="scene-canvas-host"
      aria-hidden="true"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointerRef.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointerRef.current.ty = -((e.clientY - r.top) / r.height - 0.5) * 2;
      }}
      onPointerLeave={() => {
        pointerRef.current.tx = 0;
        pointerRef.current.ty = 0;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Canvas
        camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, 8.4] }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <directionalLight color={0xffffff} intensity={0.9} position={[3, 4, 5]} />
        <directionalLight color={0xffffff} intensity={0.35} position={[-4, -2, 3]} />
        <ambientLight color={0xffffff} intensity={0.35} />
        <Scene pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
