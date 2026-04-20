'use client';

// Client wrapper so the Three.js crane loads via next/dynamic({ ssr: false })
// without making the Wanderer server component client itself.
//
// Runtime motion gate: mirrors AgentGraphClient. The crane itself checks
// motion once at mount — that's correct for "should we initialise at
// all?" but doesn't cover the runtime toggle case (TweakBridge's motion
// swatch or an OS-level reduced-motion flip). We gate the whole dynamic
// import here via `useSyncExternalStore`, so toggling off unmounts the
// crane (runs its cleanup + re-shows the SVG fallback) and toggling on
// remounts + reinitialises cleanly.

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

const WandererCrane = dynamic(() => import('@/components/scene/WandererCrane'), {
  ssr: false,
});

function getSnapshot(): boolean {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return false;
  return document.documentElement.getAttribute('data-motion') !== 'off';
}

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

export function WandererCraneClient() {
  const render = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!render) return null;
  return <WandererCrane />;
}
