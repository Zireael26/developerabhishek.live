import { SectionHeader } from './SectionHeader';

export function About() {
  return (
    <section
      className="about"
      id="about"
      data-screen-label="02 About"
      data-companion-pose="about"
      aria-label="02 About"
    >
      <SectionHeader num="02" title="About" />
      <div className="about-grid">
        <figure className="about-portrait" aria-hidden="true">
          <svg
            viewBox="0 0 320 400"
            className="placeholder placeholder-portrait"
          >
            <defs>
              <pattern
                id="stripes-portrait"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="var(--ink-15)"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            <rect width="320" height="400" fill="var(--ink-05)" />
            <rect width="320" height="400" fill="url(#stripes-portrait)" />
            <text x="160" y="200" textAnchor="middle" className="placeholder-label">
              portrait.jpg
            </text>
            <text
              x="160"
              y="222"
              textAnchor="middle"
              className="placeholder-sublabel"
            >
              about/abhishek.webp · 4:5
            </text>
          </svg>
          <figcaption>
            Abhishek, 2026 — candid, working-at-desk framing.
          </figcaption>
        </figure>
        <div className="about-prose">
          <p className="about-kicker">The short version</p>
          <p className="about-lede">
            I&apos;m Abhishek — an AI engineer who builds agent systems that
            businesses can <em>actually</em> run.
          </p>
          <p>
            For the last six years I&apos;ve been shipping software — AI and
            platform engineering for the past stretch of it, most recently on
            the agents framework behind Bluehost&apos;s AI products. Outside of
            that, I&apos;m building <a href="#work">Neev</a>, a modular
            operations platform for Indian MSMEs starting with textile
            distribution — because the most exciting place for AI right now
            isn&apos;t another consumer chatbot. It&apos;s the{' '}
            <strong>63 million businesses</strong> still running on WhatsApp
            messages and paper ledgers.
          </p>
          <p>
            My way into AI was Andrej Karpathy&apos;s <em>Zero to Hero</em>{' '}
            series. I didn&apos;t just watch it — I built micrograd and makemore
            from scratch to understand what I was watching. That habit, going to
            the foundations rather than the abstractions, is how I work on most
            things. Including this site.
          </p>
          <ul className="about-meta">
            <li>
              <span>Now</span>Bluehost · agents framework backend
            </li>
            <li>
              <span>Building</span>Neev · MSME operations platform
            </li>
            <li>
              <span>Co-founder / CTO</span>VeriCite · curat.money
            </li>
            <li>
              <span>Writes</span>agent systems · AI for traditional business
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
