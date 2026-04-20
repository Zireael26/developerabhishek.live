import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

type ArrowLinkProps = {
  href: LinkProps['href'];
  children: ReactNode;
  className?: string;
  arrow?: string;
};

export function ArrowLink({
  href,
  children,
  className,
  arrow = '→',
}: ArrowLinkProps) {
  const hrefString = typeof href === 'string' ? href : '';
  const isHash = hrefString.startsWith('#');
  const isExternal = /^https?:\/\//.test(hrefString);

  const content = (
    <>
      {children}
      <span className="arrow" aria-hidden="true">
        {arrow}
      </span>
    </>
  );

  if (isHash || isExternal) {
    return (
      <a
        href={hrefString}
        className={className}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
