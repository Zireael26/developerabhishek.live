import Image from 'next/image';

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
        <figure className="about-portrait">
          <Image
            src="/images/about/abhishek.webp"
            alt="Portrait of Abhishek Kaushik"
            width={768}
            height={960}
            sizes="(max-width: 800px) 320px, 34vw"
            className="about-portrait-image"
          />
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
