import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { ComponentProps } from 'react';
import type { MDXRemote } from 'next-mdx-remote/rsc';

type MDXRemoteOptions = NonNullable<ComponentProps<typeof MDXRemote>['options']>;

// Shared across CaseStudyPage and the writing detail page so the plugin stack
// can only change in one place. `rehypePlugins` needs `as never` to satisfy
// next-mdx-remote's non-readonly Pluggable[] signature — compile-only, no
// runtime effect. Documented in ADR-0004.
export const MDX_OPTIONS: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { light: 'github-light', dark: 'github-dark-dimmed' },
          keepBackground: false,
        },
      ],
    ] as never,
  },
};
