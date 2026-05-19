import { test, expect } from '@playwright/test';

// Asserts every agent-readiness surface promised by docs/AGENT_READINESS.md
// is alive. Each endpoint: 200 status, correct content-type, non-empty body,
// and a basic shape check. Cheap, single-file, runs on chromium-desktop.

test.describe.configure({ mode: 'serial' });

test.describe('agent readiness', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'agent-readiness assertions are protocol-level; one engine is enough.',
  );

  test('/llms.txt returns markdown with H1 + blockquote summary', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/text\/markdown/);
    const body = await res.text();
    expect(body).toMatch(/^# /m);
    expect(body).toMatch(/^> /m);
  });

  test('/llms-full.txt assembles the full corpus', async ({ request }) => {
    const res = await request.get('/llms-full.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/text\/markdown/);
    const body = await res.text();
    expect(body.length).toBeGreaterThan(5000);
    expect(body).toContain('<about>');
    expect(body).toContain('<services>');
    expect(body).toContain('<case-study slug="neev">');
  });

  test('/robots.txt allows crawlers and references the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/User-agent:\s*\*/);
    expect(body).toMatch(/sitemap/i);
  });

  test('/sitemap.xml lists at least the home, work, and writing trees', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/xml/);
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('https://akaushik.org');
    expect(body).toContain('/work/');
    expect(body).toContain('/writing/');
  });

  test('/.well-known/api-catalog returns a RFC 9727 linkset', async ({ request }) => {
    const res = await request.get('/.well-known/api-catalog');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('linkset');
  });

  test('/.well-known/mcp.json signals planned status and does not advertise an endpoint', async ({
    request,
  }) => {
    const res = await request.get('/.well-known/mcp.json');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('name');
    expect(body).not.toHaveProperty('endpoint');
    expect(body.status).toBe('planned');
  });

  test('/.well-known/agent-skills/index.json uses v0.2.0 schema with a digest', async ({
    request,
  }) => {
    const res = await request.get('/.well-known/agent-skills/index.json');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('$schema');
    expect(body).toHaveProperty('skills');
    expect(Array.isArray(body.skills)).toBe(true);
    expect(body.skills.length).toBeGreaterThan(0);
    expect(body.skills[0]).toHaveProperty('digest');
    expect(body.skills[0].digest).toMatch(/^sha256:/);
  });

  test('/.well-known/agent-skills/hire-me/SKILL.md is served', async ({ request }) => {
    const res = await request.get('/.well-known/agent-skills/hire-me/SKILL.md');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/^---/);
    expect(body).toMatch(/^# /m);
  });

  test('/api/openapi.json validates as OpenAPI 3.1', async ({ request }) => {
    const res = await request.get('/api/openapi.json');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/application\/json/);
    const body = await res.json();
    expect(body.openapi).toMatch(/^3\.1/);
    expect(body.info).toHaveProperty('title');
    expect(typeof body.paths).toBe('object');
    expect(Object.keys(body.paths).length).toBeGreaterThan(0);
  });

  test('/api/case-studies returns { count, caseStudies } shape', async ({ request }) => {
    const res = await request.get('/api/case-studies');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/application\/json/);
    const body = await res.json();
    expect(body).toHaveProperty('count');
    expect(Array.isArray(body.caseStudies)).toBe(true);
    expect(body.caseStudies.length).toBeGreaterThanOrEqual(4);
    expect(body.caseStudies[0]).toHaveProperty('slug');
    expect(body.count).toBe(body.caseStudies.length);
  });

  test('/api/writing returns posts newest-first with reading times', async ({ request }) => {
    const res = await request.get('/api/writing');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/application\/json/);
    const body = await res.json();
    expect(body).toHaveProperty('count');
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThanOrEqual(3);
    expect(body.posts[0]).toHaveProperty('slug');
    expect(body.posts[0]).toHaveProperty('readingTime');
    // Sorted newest-first: dates non-increasing.
    for (let i = 1; i < body.posts.length; i++) {
      expect(body.posts[i - 1].date >= body.posts[i].date).toBe(true);
    }
  });

  test('home page Link header advertises every agent-readiness rel', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const link = res.headers()['link'];
    expect(link).toBeTruthy();
    expect(link).toContain('rel="describedby"');
    expect(link).toContain('rel="sitemap"');
    expect(link).toContain('rel="api-catalog"');
    expect(link).toContain('rel="service-desc"');
    expect(link).toContain('rel="service-doc"');
    expect(link).toContain('llms.txt');
    expect(link).toContain('llms-full.txt');
    expect(link).toContain('api-catalog');
  });

  test('/api/docs renders the OpenAPI spec as HTML', async ({ request }) => {
    const res = await request.get('/api/docs');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/text\/html/);
    const body = await res.text();
    expect(body).toContain('akaushik.org portfolio API');
    expect(body).toContain('OpenAPI 3.1');
    // Every documented path should appear at least once in the rendered page.
    for (const path of [
      '/llms.txt',
      '/llms-full.txt',
      '/api/writing',
      '/api/case-studies',
    ]) {
      expect(body).toContain(path);
    }
  });
});
