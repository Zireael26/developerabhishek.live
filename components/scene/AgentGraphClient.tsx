'use client';

// Thin client wrapper around the dynamic import so `Hero.tsx` (a server
// component) can include the R3F canvas without becoming client itself.
// Next 16 rejects `next/dynamic({ ssr: false })` inside server components;
// the gate moves down one layer here.
//
// Runtime reduced-motion gate: CSS `display: none` doesn't stop the R3F
// `<Canvas>` from creating a WebGL context or `useFrame` from running at
// 60fps. We read `prefers-reduced-motion` and `[data-motion]` on the
// client and return null in both cases so Three.js isn't even imported.
// Live MutationObserver on `data-motion` means the TweakBridge motion
// toggle takes effect without a reload.

import dynamic from 'next/dynamic';
import { useEffect, useRef, useSyncExternalStore } from 'react';

const AgentGraph = dynamic(() => import('@/components/scene/AgentGraph'), {
  ssr: false,
});

function getSnapshot(): boolean {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return false;
  return document.documentElement.getAttribute('data-motion') !== 'off';
}

// Server can't know motion preference; assume off so the canvas doesn't
// render on SSR. The SVG fallback ships via StaticSVGScene.
function getServerSnapshot(): boolean {
  return false;
}

function subscribe(cb: () => void): () => void {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });
  return () => {
    mql.removeEventListener('change', cb);
    mo.disconnect();
  };
}

export function AgentGraphClient() {
  const render = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hostRef = useRef<HTMLSpanElement>(null);

  // R3F Canvas uses alpha:true; without an active-signal the SSR SVG bleeds
  // through. Mark the enclosing scene-frame so CSS can hide the SVG once the
  // canvas is live and restore it when motion toggles off.
  useEffect(() => {
    const frame = hostRef.current?.closest<HTMLElement>('.scene-frame');
    if (!frame) return;
    if (render) {
      frame.setAttribute('data-canvas-active', 'true');
      return () => frame.removeAttribute('data-canvas-active');
    }
    frame.removeAttribute('data-canvas-active');
    return undefined;
  }, [render]);

  return (
    <>
      <span ref={hostRef} hidden aria-hidden="true" />
      {render ? <AgentGraph /> : null}
    </>
  );
}
