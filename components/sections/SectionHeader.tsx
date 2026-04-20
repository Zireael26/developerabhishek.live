import type { ReactNode } from 'react';

type SectionHeaderProps = {
  num: string;
  title: string;
  kicker?: ReactNode;
};

export function SectionHeader({ num, title, kicker }: SectionHeaderProps) {
  return (
    <div className="section-head">
      <span className="section-num">{num}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" />
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
    </div>
  );
}
