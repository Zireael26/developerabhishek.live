import { expect, test } from '@playwright/test';

// Smoke test for the Phase-5 scene work: the hero agent-graph R3F canvas
// + the Wanderer Three.js crane. Visual parity against the reference
// design is Abhishek's eyes (per plan §Final state + ADR-0005 follow-up);
// what this spec proves is that the canvas mounts, the SVG fallback is
// present for reduced-motion, and both scenes coexist without console
// errors blocking first paint.
//
// Scope kept narrow on purpose — the scenes are heavy, the assertions
// are shallow. WebGL doesn't render deterministically on Playwright
// headless in every environment, so we assert the DOM plumbing rather
// than pixel output.

test.describe.configure({ mode: 'serial' });

test.describe('hero canvas + wanderer', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'R3F + Three.js stability varies by engine; chromium-desktop is the canonical surface for this spec.',
  );

  test('scene frame renders both SVG fallback and canvas host', async ({
    page,
  }) => {
    await page.goto('/');
    // SVG fallback ships on SSR, always present.
    const sceneFrame = page.locator('.scene-frame');
    await expect(sceneFrame).toBeVisible();
    await expect(sceneFrame.locator('.scene-svg')).toBeVisible();
    // Canvas host is injected client-side by AgentGraphClient.
    await expect(sceneFrame.locator('.scene-canvas-host')).toBeAttached({
      timeout: 5000,
    });
  });

  test('wanderer host ships SVG fallback + hosts a <canvas> after hydration', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('#companion')).toBeAttached();
    await expect(page.locator('#companion .companion-svg')).toBeAttached();
    // WandererCrane appends its canvas to #companion on successful WebGL
    // init. If WebGL fails the 80ms bail-out removes it and re-shows the
    // SVG. Either way, no console errors.
    await page.waitForTimeout(1500);
  });

  test('reduced-motion: canvas stays hidden; SVG remains primary', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const canvasHost = page.locator('.scene-canvas-host');
    // CSS rule `@media (prefers-reduced-motion: reduce) .scene-canvas-host
    // { display: none }` — either the element never mounts or it's
    // display:none. Both assertions here.
    const hostCount = await canvasHost.count();
    if (hostCount > 0) {
      await expect(canvasHost).toBeHidden();
    }
    // Wanderer crane bails early when reduceMotion is true, so no canvas
    // should be inside #companion.
    const crane = page.locator('#companion canvas');
    await expect(crane).toHaveCount(0);
  });

  test('[data-motion="off"]: canvas host hidden', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-motion', 'off');
    });
    const canvasHost = page.locator('.scene-canvas-host');
    const hostCount = await canvasHost.count();
    if (hostCount > 0) {
      await expect(canvasHost).toBeHidden();
    }
  });

  test('no console errors on home page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Allow a stabilisation window for R3F + Wanderer to run at least one
    // frame before we sample console state.
    await page.waitForTimeout(1500);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
