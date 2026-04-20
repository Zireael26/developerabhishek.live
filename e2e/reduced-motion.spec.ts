import { test, expect } from '@playwright/test';

test.describe('prefers-reduced-motion', () => {
  test('marquee track has no running animation when user prefers reduced motion', async ({
    page,
  }) => {
    // `page.emulateMedia({ reducedMotion: 'reduce' })` is the browser-level
    // signal the CSS queries. Apply before navigation so the initial paint
    // already honours it.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const track = page.locator('.hero-marquee .marquee-track').first();
    await expect(track).toBeVisible();

    // Assert the computed animation is "none" (or paused via play-state).
    // Don't chase specific keyframes — assert the effect isn't running, which
    // is what the user experience depends on.
    const { animationName, animationPlayState } = await track.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        animationName: cs.animationName,
        animationPlayState: cs.animationPlayState,
      };
    });

    expect(
      animationName === 'none' || animationPlayState === 'paused',
      `expected marquee paused under reduced-motion, got animation-name="${animationName}" play-state="${animationPlayState}"`,
    ).toBe(true);
  });
});
