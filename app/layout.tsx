import type { Metadata, Viewport } from 'next';
import './globals.css';

// Google Fonts referenced via next/font can be added here during the full
// recreation; the scaffold uses the same <link> approach as the reference
// so the parchment base renders the right typography immediately.
export const metadata: Metadata = {
  metadataBase: new URL('https://developerabhishek.live'),
  title: {
    default: 'Abhishek Kaushik — AI systems for businesses that haven’t met AI yet',
    template: '%s · Abhishek Kaushik',
  },
  description:
    'Independent engineer building agent-native software. Modular monoliths, retrieval systems, and operational AI for teams that care about how things feel.',
  applicationName: 'developerabhishek.live',
  authors: [{ name: 'Abhishek Kaushik', url: 'https://developerabhishek.live' }],
  creator: 'Abhishek Kaushik',
  openGraph: {
    type: 'website',
    url: 'https://developerabhishek.live',
    siteName: 'developerabhishek.live',
    title: 'Abhishek Kaushik — AI systems for businesses that haven’t met AI yet',
    description:
      'Independent engineer building agent-native software. Case studies: Neev, VeriCite, Bluehost Agents, curat.money.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@abhi2601k',
  },
  // Agent-readiness: llms.txt + Agent Skills index are linked at document level so
  // agent crawlers see them without traversing the DOM.
  other: {
    'link-llms': '</llms.txt>; rel="llms-txt"; type="text/plain"',
    'link-agent-skills': '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* RFC 8288 Link headers — duplicated as <link> tags for crawlers that don't
            see headers (e.g. static-HTML-only agents). */}
        <link rel="llms-txt" type="text/plain" href="/llms.txt" />
        <link rel="agent-skills" href="/.well-known/agent-skills/index.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
