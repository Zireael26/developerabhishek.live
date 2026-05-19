import Image from 'next/image';
import { Fragment, type ReactNode } from 'react';

import { ABOUT_COPY } from '@/lib/about-copy';
import { SectionHeader } from './SectionHeader';

// Inline-markdown renderer supporting **bold**, *italic*, and [text](url)
// links only. Returns React nodes — never raw HTML strings — so there is no
// XSS surface even if ABOUT_COPY drifts to operator-edited content.
// Tokens matched in order via matchAll: link, bold, italic. No nested
// formatting (`**[a](b)**` renders as bold containing plain text).
function renderInline(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }
    if (match[1] !== undefined && match[2] !== undefined) {
      nodes.push(
        <a key={key++} href={match[2]}>
          {match[1]}
        </a>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={key++}>{match[3]}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key++}>{match[4]}</em>);
    }
    cursor = start + match[0].length;
  }
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes.map((node, i) =>
    typeof node === 'string' ? <Fragment key={`t${i}`}>{node}</Fragment> : node,
  );
}

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
        </figure>
        <div className="about-prose">
          <p className="about-kicker">{ABOUT_COPY.kicker}</p>
          <p className="about-lede">{renderInline(ABOUT_COPY.lede)}</p>
          {ABOUT_COPY.paragraphs.map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
          <ul className="about-meta">
            {ABOUT_COPY.meta.map((row) => (
              <li key={row.label}>
                <span>{row.label}</span>
                {row.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
