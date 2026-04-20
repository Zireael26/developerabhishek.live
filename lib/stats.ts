import statsJson from '@/public/data/stats.json';

export type StatsRepo = {
  name: string;
  label: string;
  url: string;
  commits12mo: number;
  lastCommit: string;
};

export type Stats = {
  generatedAt: string;
  username: string;
  window: string;
  includesPrivate: boolean;
  totalContributions: number;
  weeks: number[];
  repos: StatsRepo[];
};

export function getStats(): Stats {
  const {
    generatedAt,
    username,
    window,
    includesPrivate,
    totalContributions,
    weeks,
    repos,
  } = statsJson as Stats;
  return {
    generatedAt,
    username,
    window,
    includesPrivate,
    totalContributions,
    weeks,
    repos,
  };
}
