export default function SiteFooter() {
  const year = new Date().getFullYear();
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const shortSha = sha ? sha.slice(0, 7) : null;

  return (
    <footer className="site-foot">
      <div className="foot-row">
        <span className="foot-mark">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <circle cx="5" cy="12" r="2.2" />
            <circle cx="19" cy="6" r="2.2" />
            <circle cx="19" cy="18" r="2.2" />
            <path d="M6.8 11 17 6.8 M6.8 13 17 17.2" stroke="currentColor" strokeWidth="1.1" fill="none" />
          </svg>
          Abhishek Kaushik · © {year}
        </span>
        <span className="foot-colophon">
          Set in Newsreader &amp; Plus Jakarta Sans. Built in the open
          {shortSha ? ` · ${shortSha}` : ''}.
        </span>
        <span className="foot-links">
          <a href="#process">/process</a>
          <a href="/llms.txt">/llms.txt</a>
          <a href="/sitemap.xml">/sitemap.xml</a>
        </span>
      </div>
    </footer>
  );
}
