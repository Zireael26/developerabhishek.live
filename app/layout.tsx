import type { Metadata, Viewport } from 'next';
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// next/font self-hosts the three families and exposes them as CSS variables so
// globals.css can resolve `--serif / --sans / --mono` without a runtime <link>.
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
      className={`${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* RFC 8288 Link headers — duplicated as <link> tags for crawlers that don't
            see headers (e.g. static-HTML-only agents). */}
        <link rel="llms-txt" type="text/plain" href="/llms.txt" />
        <link rel="agent-skills" href="/.well-known/agent-skills/index.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
