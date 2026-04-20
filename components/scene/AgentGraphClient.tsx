'use client';

// Thin client wrapper around the dynamic import so `Hero.tsx` (a server
// component) can include the R3F canvas without becoming client itself.
// Next 16 rejects `next/dynamic({ ssr: false })` inside server components;
// the gate moves down one layer here.

import dynamic from 'next/dynamic';

const AgentGraph = dynamic(() => import('@/components/scene/AgentGraph'), {
  ssr: false,
});

export function AgentGraphClient() {
  return <AgentGraph />;
}
