import { describe, expect, it } from 'vitest';
import {
  getPost,
  getPostSlugs,
  getAllPosts,
  getAllPostsWithReadingTime,
} from './content';

// These tests exercise the real `content/` directory rather than mocking the
// filesystem — the parser's job is to handle the real frontmatter shapes the
// project ships, and pinning the assertions to the real corpus catches drift
// (a new mandatory frontmatter field, a malformed file) at unit-test time.

describe('content — getPostSlugs', () => {
  it('returns case-study slugs in sorted order', () => {
    const slugs = getPostSlugs('case-studies');
    expect(slugs.length).toBeGreaterThanOrEqual(4);
    expect(slugs).toEqual([...slugs].sort());
  });

  it('returns writing slugs in sorted order', () => {
    const slugs = getPostSlugs('writing');
    expect(slugs.length).toBeGreaterThanOrEqual(3);
    expect(slugs).toEqual([...slugs].sort());
  });

  it('strips the .mdx extension', () => {
    const slugs = getPostSlugs('writing');
    for (const s of slugs) {
      expect(s).not.toMatch(/\.mdx$/);
    }
  });
});

describe('content — getPost', () => {
  it('returns null for an unknown slug', () => {
    expect(getPost('case-studies', 'does-not-exist')).toBeNull();
    expect(getPost('writing', 'no-such-post')).toBeNull();
  });

  it('parses the four required case-study frontmatter fields', () => {
    const post = getPost('case-studies', 'neev');
    expect(post).not.toBeNull();
    if (!post) return;
    expect(post.slug).toBe('neev');
    expect(post.frontmatter.title).toBeTruthy();
    expect(post.frontmatter.dek).toBeTruthy();
    expect(post.frontmatter.index).toBeTruthy();
    expect(post.frontmatter.tag).toBeTruthy();
    expect(post.frontmatter.year).toBeTruthy();
    expect(post.frontmatter.role).toBeTruthy();
    expect(post.frontmatter.evidenceOf).toBeTruthy();
  });

  it('parses inline-array stack values', () => {
    const post = getPost('case-studies', 'neev');
    if (!post) throw new Error('expected neev case study');
    expect(Array.isArray(post.frontmatter.stack)).toBe(true);
    expect(post.frontmatter.stack.length).toBeGreaterThan(0);
  });

  it('parses writing frontmatter', () => {
    const post = getPost('writing', 'micrograd-makemore');
    expect(post).not.toBeNull();
    if (!post) return;
    expect(post.frontmatter.title).toBeTruthy();
    expect(post.frontmatter.dek).toBeTruthy();
    expect(post.frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('separates frontmatter from the body content', () => {
    const post = getPost('writing', 'micrograd-makemore');
    if (!post) throw new Error('expected micrograd post');
    expect(post.content).not.toContain('---\ntitle:');
    expect(post.content.trim().length).toBeGreaterThan(0);
  });
});

describe('content — getAllPosts', () => {
  it('returns one entry per slug, frontmatter only', () => {
    const posts = getAllPosts('case-studies');
    expect(posts.length).toBeGreaterThanOrEqual(4);
    for (const p of posts) {
      expect(p).toHaveProperty('slug');
      expect(p).toHaveProperty('frontmatter');
      expect(p).not.toHaveProperty('content');
    }
  });

  it('matches getPostSlugs in length and order', () => {
    const posts = getAllPosts('writing');
    const slugs = getPostSlugs('writing');
    expect(posts.map((p) => p.slug)).toEqual(slugs);
  });
});

describe('content — getAllPostsWithReadingTime', () => {
  it('adds a readingTime field shaped "N min read"', () => {
    const posts = getAllPostsWithReadingTime('writing');
    expect(posts.length).toBeGreaterThanOrEqual(3);
    for (const p of posts) {
      expect(p.readingTime).toMatch(/^\d+ min read$/);
    }
  });

  it('preserves explicit frontmatter readingTime when present (none of the current posts set it, so this asserts the fallback runs)', () => {
    const posts = getAllPostsWithReadingTime('writing');
    for (const p of posts) {
      expect(p.readingTime).toBeTruthy();
    }
  });
});
