import { describe, expect, it } from 'vitest';
import { CANONICAL_ORIGIN, canonical } from './canonical';

describe('canonical', () => {
  it('exports the origin as https://akaushik.org', () => {
    expect(CANONICAL_ORIGIN).toBe('https://akaushik.org');
  });

  it('passes absolute https URLs through unchanged', () => {
    expect(canonical('https://akaushik.org/work/neev')).toBe('https://akaushik.org/work/neev');
  });

  it('passes absolute http URLs through unchanged', () => {
    expect(canonical('http://example.com/path')).toBe('http://example.com/path');
  });

  it('prefixes a leading slash to a relative path missing one', () => {
    expect(canonical('writing/foo')).toBe('https://akaushik.org/writing/foo');
  });

  it('keeps an already-present leading slash', () => {
    expect(canonical('/writing/foo')).toBe('https://akaushik.org/writing/foo');
  });

  it('preserves query strings', () => {
    expect(canonical('/work?utm_source=ref')).toBe('https://akaushik.org/work?utm_source=ref');
  });

  it('preserves hash fragments', () => {
    expect(canonical('/work#neev')).toBe('https://akaushik.org/work#neev');
  });

  it('is case-insensitive on the protocol detection', () => {
    expect(canonical('HTTPS://akaushik.org/x')).toBe('HTTPS://akaushik.org/x');
  });
});
