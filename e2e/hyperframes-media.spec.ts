import { expect, test } from '@playwright/test';

const LOOPS = [
  {
    path: '/writing/building-this-portfolio',
    kind: 'writing',
    slug: 'building-this-portfolio',
    mp4: '/video/writing/building-this-portfolio.mp4',
    poster: '/video/writing/building-this-portfolio.webp',
  },
  {
    path: '/writing/micrograd-makemore',
    kind: 'writing',
    slug: 'micrograd-makemore',
    mp4: '/video/writing/micrograd-makemore.mp4',
    poster: '/video/writing/micrograd-makemore.webp',
  },
  {
    path: '/writing/ai-for-msme',
    kind: 'writing',
    slug: 'ai-for-msme',
    mp4: '/video/writing/ai-for-msme.mp4',
    poster: '/video/writing/ai-for-msme.webp',
  },
  {
    path: '/writing/fastembed-to-tei',
    kind: 'writing',
    slug: 'fastembed-to-tei',
    mp4: '/video/writing/fastembed-to-tei.mp4',
    poster: '/video/writing/fastembed-to-tei.webp',
  },
  {
    path: '/work/neev',
    kind: 'work-inline',
    slug: 'neev',
    mp4: '/video/work/inline/neev.mp4',
    poster: '/video/work/inline/neev.webp',
  },
] as const;

test.describe('HyperFrames media loops', () => {
  test('writing and work loops use the SVG floor plus muted video contract', async ({ page }) => {
    for (const loop of LOOPS) {
      await page.goto(loop.path);

      const figure = page.locator('.media-loop').first();
      const video = figure.locator(`video[data-kind="${loop.kind}"][data-slug="${loop.slug}"]`);

      await expect(figure.locator('svg.media-loop-fallback')).toBeAttached();
      await expect(video).toBeAttached();
      await expect(video).toHaveAttribute('preload', 'none');
      await expect(video).toHaveAttribute('muted', '');
      await expect(video).toHaveAttribute('loop', '');
      await expect(video).toHaveAttribute('playsinline', '');
      await expect(video).toHaveAttribute('poster', loop.poster);
      await expect(video.locator('source')).toHaveAttribute('src', loop.mp4);
      await expect(video.locator('source')).toHaveAttribute(
        'media',
        '(prefers-reduced-motion: no-preference)',
      );
    }
  });

  test('prefers-reduced-motion hides loop video without fetching MP4 bytes', async ({ page }) => {
    const mp4Requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('.mp4')) mp4Requests.push(request.url());
    });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/writing/micrograd-makemore');

    const figure = page.locator('.media-loop').first();
    await expect(figure.locator('svg.media-loop-fallback')).toBeVisible();
    await expect(figure.locator('video.media-loop-video')).toHaveCSS('display', 'none');
    await page.waitForTimeout(500);

    expect(mp4Requests).toEqual([]);
  });

  test('data-motion off keeps the floor sized while hiding loop video', async ({ page }) => {
    const mp4Requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('.mp4')) mp4Requests.push(request.url());
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('dl-tweaks-v1', JSON.stringify({ motion: 'off' }));
      document.documentElement.setAttribute('data-motion', 'off');
    });

    await page.goto('/writing/fastembed-to-tei');

    const figure = page.locator('.media-loop').first();
    const box = await figure.boundingBox();

    await expect(figure.locator('svg.media-loop-fallback')).toBeVisible();
    await expect(figure.locator('video.media-loop-video')).toHaveCSS('display', 'none');
    await expect(figure.locator('video.media-loop-video source')).toHaveCount(0);
    await page.waitForTimeout(500);

    expect(box?.width ?? 0).toBeGreaterThan(240);
    expect(box?.height ?? 0).toBeGreaterThan(130);
    expect(mp4Requests).toEqual([]);
  });

  test('data-motion off prevents work reel MP4 requests', async ({ page }) => {
    const mp4Requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('.mp4')) mp4Requests.push(request.url());
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('dl-tweaks-v1', JSON.stringify({ motion: 'off' }));
      document.documentElement.setAttribute('data-motion', 'off');
    });

    await page.goto('/');

    const reel = page.locator('.case-item').first();
    await expect(reel.locator('svg.reel-fallback')).toBeVisible();
    await expect(reel.locator('video.reel-video')).toHaveCSS('display', 'none');
    await expect(reel.locator('video.reel-video source')).toHaveCount(0);
    await page.waitForTimeout(500);

    expect(mp4Requests).toEqual([]);
  });
});
