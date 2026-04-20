import type { ReactNode } from 'react';

type SectionHeaderProps = {
  num: string;
  title: string;
  kicker?: ReactNode;
  /**
   * When provided, the note replaces the default `.section-rule` span in the
   * third grid column (see `In the open` §07 live-data label in the
   * reference, `index.html:1488`).
   */
  note?: ReactNode;
};

export function SectionHeader({ num, title, kicker, note }: SectionHeaderProps) {
  return (
    <div className="section-head">
      <span className="section-num">{num}</span>
      <h2 className="section-title">{title}</h2>
      {note ? (
        <span className="section-note">{note}</span>
      ) : (
        <span className="section-rule" />
      )}
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
    </div>
  );
}
