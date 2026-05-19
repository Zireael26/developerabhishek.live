// About section copy — single source for components/sections/About.tsx and
// app/llms-full.txt/route.ts. Edit here and both surfaces update. Mirrors
// the Services.tsx ↔ lib/services.ts pattern.
//
// paragraphs[] are markdown-light: **bold**, *italic*, and [text](url)
// links are supported by the renderInline helper in About.tsx (regex-based,
// no raw HTML strings, no third-party parser). Stay within that subset.

export const ABOUT_COPY = {
  kicker: 'The short version',
  lede: "I'm Abhishek — an AI engineer who builds agent systems that businesses can *actually* run.",
  paragraphs: [
    "For the last six years I've been shipping software — AI and platform engineering for the past stretch of it, most recently on the agents framework behind Bluehost's AI products. Outside of that, I'm building [Neev](https://akaushik.org/work/neev), a modular operations platform for Indian MSMEs starting with textile distribution — because the most exciting place for AI right now isn't another consumer chatbot. It's the **63 million businesses** still running on WhatsApp messages and paper ledgers.",
    "My way into AI was Andrej Karpathy's *Zero to Hero* series. I didn't just watch it — I built micrograd and makemore from scratch to understand what I was watching. That habit, going to the foundations rather than the abstractions, is how I work on most things. Including this site.",
  ],
  meta: [
    { label: 'Now', value: 'Bluehost · agents framework backend' },
    { label: 'Building', value: 'Neev · MSME operations platform' },
    { label: 'Co-founder / CTO', value: 'VeriCite · curat.money' },
    { label: 'Writes', value: 'agent systems · AI for traditional business' },
  ],
} as const;
