import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  turbopack: {
    root: process.cwd(),
  },
  // Sets the parchment-on-ink frame for image / static assets.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Agent-readiness: set discoverability headers in middleware.ts; this is the build-time
  // declaration for the static .well-known/* routes that are served from /public.
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        // `/llms.txt` is still served from `/public` (static); `/llms-full.txt`
        // migrated to a Route Handler in Slice 4.2 which sets its own headers.
        // AGENT_READINESS §4.2 notes `text/markdown` is the correct MIME for
        // both, not `text/plain`.
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=300' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
