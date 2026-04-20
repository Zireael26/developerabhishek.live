import type { Metadata, Viewport } from 'next';
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import { Wanderer } from '@/components/scene/Wanderer';
import { TweakBridge } from '@/components/dev/TweakBridge';
import './globals.css';

// Cloudflare Web Analytics beacon — cookieless, no consent banner needed
// (per memory: Cloudflare analytics, not @vercel/analytics). Token read
// from NEXT_PUBLIC_CF_BEACON_TOKEN so it ships nowhere the codebase can
// see. When unset (dev / preview) the script is a no-op.
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://akaushik.org'),
  title: {
    default: 'Abhishek Kaushik — AI systems for businesses that haven’t met AI yet',
    template: '%s · Abhishek Kaushik',
  },
  description:
    'Independent engineer building agent-native software. Modular monoliths, retrieval systems, and operational AI for teams that care about how things feel.',
  applicationName: 'akaushik.org',
  authors: [{ name: 'Abhishek Kaushik', url: 'https://akaushik.org' }],
  creator: 'Abhishek Kaushik',
  openGraph: {
    type: 'website',
    url: 'https://akaushik.org',
    siteName: 'akaushik.org',
    title: 'Abhishek Kaushik — AI systems for businesses that haven’t met AI yet',
    description:
      'Independent engineer building agent-native software. Case studies: Neev, VeriCite, Bluehost Agents, curat.money.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@abhi2601k',
  },
  other: {
    'link-llms': '</llms.txt>; rel="llms-txt"; type="text/plain"',
    'link-agent-skills': '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F1E8' },
    { media: '(prefers-color-scheme: dark)', color: '#121417' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      data-accent="forest"
      data-density="airy"
      data-motion="on"
      data-tagline="a"
      className={`${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-hydration theme bootstrap — /public/init-theme.js reads the user's
            stored choice or system preference and sets html[data-mode] before
            first paint. The sync load is deliberate: an async/deferred script
            would paint first, then flip theme, causing FOUC for dark-preference
            users. Matches components/site/ThemeToggle.tsx (storage key + fallback). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/init-theme.js" />
        {/* RFC 8288 Link header duplicates — for crawlers that skip HTTP
            headers. Same rels as middleware.ts; types match AGENT_READINESS §3.3. */}
        <link rel="describedby" type="text/markdown" href="/llms.txt" />
        <link rel="describedby" type="text/markdown" href="/llms-full.txt" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body>
        {/* Wanderer renders the #companion host with its SVG fallback today.
            Slice 5.1c layers the Three.js crane on top for `[data-motion="on"]`
            + no `prefers-reduced-motion`. The SVG stays as the fallback. */}
        <Wanderer />
        <SiteNav />
        {children}
        <SiteFooter />
        <TweakBridge />
        {CF_BEACON_TOKEN ? (
          <Script
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}"}`}
          />
        ) : null}
      </body>
    </html>
  );
}
