import { SectionHeader } from './SectionHeader';
import { getStats } from '@/lib/stats';

const SPARK_WIDTH = 520;
const SPARK_HEIGHT = 120;
const BAR_WIDTH = 7;
const BAR_GAP = 3;
const MAX_BAR_HEIGHT = 90;

function formatRelativeDays(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24)));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 365)} years ago`;
}

export function OpenSource() {
  const stats = getStats();
  const max = Math.max(...stats.weeks, 1);
  const maxCommits = Math.max(...stats.repos.map((r) => r.commits12mo), 1);

  return (
    <section
      className="opensource"
      id="open"
      data-screen-label="07 In the open"
      data-companion-pose="open"
      aria-label="07 In the open"
    >
      <SectionHeader
        num="07"
        title="In the open"
        note={
          <>
            live from github ·{' '}
            <a
              href={`https://github.com/${stats.username}`}
              className="section-note-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{stats.username}
            </a>
          </>
        }
      />
      <div className="os-inner">
        <div className="os-total">
          <span className="os-label">Contributions, last 12 months</span>
          <span className="os-number">
            {stats.totalContributions.toLocaleString('en-US')}
          </span>
          <span className="os-sub">
            {stats.includesPrivate ? 'private repos included · ' : ''}
            refreshed {formatRelativeDays(stats.generatedAt)}
          </span>
        </div>
        <figure
          className="os-spark"
          aria-label="Weekly contribution sparkline, oldest to newest"
        >
          <svg
            className="os-spark-svg"
            viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect
              x="0"
              y={SPARK_HEIGHT - 0.5}
              width={SPARK_WIDTH}
              height="0.5"
              className="os-spark-axis"
            />
            {stats.weeks.map((v, i) => {
              const height = (v / max) * MAX_BAR_HEIGHT;
              const x = i * (BAR_WIDTH + BAR_GAP);
              const y = SPARK_HEIGHT - height;
              const opacity = 0.45 + 0.55 * (v / max);
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={Math.max(1, height)}
                  opacity={opacity}
                />
              );
            })}
          </svg>
          <figcaption>52 weeks · oldest → newest</figcaption>
        </figure>
        <ul className="os-repos" role="list">
          {stats.repos.map((repo) => {
            const percent = (repo.commits12mo / maxCommits) * 100;
            return (
              <li className="os-repo" key={repo.name}>
                <span className="os-repo-name">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.label}
                  </a>
                </span>
                <div
                  className="os-repo-bar"
                  aria-hidden="true"
                  role="presentation"
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
                <span className="os-repo-count">
                  <em>{repo.commits12mo.toLocaleString('en-US')}</em> commits ·
                  last 12mo
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
