'use client';

import { useSyncExternalStore } from 'react';

type MotionVideoProps = {
  className: string;
  mp4: string;
  poster: string;
  width: number;
  height: number;
  kind?: string;
  slug: string;
  variant?: string;
};

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

export function MotionVideo({
  className,
  mp4,
  poster,
  width,
  height,
  kind,
  slug,
  variant,
}: MotionVideoProps) {
  const canLoadMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <video
      className={className}
      data-kind={kind}
      data-slug={slug}
      data-variant={variant}
      width={width}
      height={height}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
    >
      {canLoadMotion ? (
        <source
          src={mp4}
          type="video/mp4"
          media="(prefers-reduced-motion: no-preference)"
        />
      ) : null}
    </video>
  );
}
