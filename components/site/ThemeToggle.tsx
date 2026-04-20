'use client';

import { useCallback, useEffect } from 'react';

const STORAGE_KEY = 'abhishek.portfolio.mode';
type Mode = 'light' | 'dark';

function applyMode(mode: Mode) {
  document.documentElement.setAttribute('data-mode', mode);
}

export default function ThemeToggle() {
  // External-system sync: once on mount, reconcile html[data-mode] with the
  // user's stored choice (if any) or their system preference. The DOM attribute
  // is the source of truth — CSS swaps the sun/moon icon off that attribute, so
  // no component state is needed to render.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      applyMode(stored);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyMode(prefersDark ? 'dark' : 'light');
  }, []);

  const toggle = useCallback(() => {
    const current = document.documentElement.getAttribute('data-mode');
    const next: Mode = current === 'dark' ? 'light' : 'dark';
    applyMode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle color theme"
      title="Toggle theme"
      onClick={toggle}
    >
      <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
        </g>
      </svg>
      <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
