'use client';

// Client wrapper so the Three.js crane loads via next/dynamic({ ssr: false })
// without making the Wanderer server component client itself.

import dynamic from 'next/dynamic';

const WandererCrane = dynamic(() => import('@/components/scene/WandererCrane'), {
  ssr: false,
});

export function WandererCraneClient() {
  return <WandererCrane />;
}
