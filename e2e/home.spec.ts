import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home page', () => {
  test('all eight sections render', async ({ page }) => {
    await page.goto('/');

    // Hero has class `.hero` (no id — the wordmark anchor uses #top as the
    // back-to-top target). The other seven have stable section ids.
    await expect(page.locator('section.hero')).toBeVisible();

    const sectionIds = [
      '#about',
      '#work',
      '#writing',
      '#services',
      '#process',
      '#open',
      '#contact',
    ];

    for (const id of sectionIds) {
      await expect(page.locator(id)).toBeVisible();
    }
  });

  test('nav anchor links scroll to the corresponding section', async ({
    page,
    viewport,
  }) => {
    // `.nav-links` is hidden on narrow viewports (see
    // `app/globals.css::@media (max-width: 860px)`). Mobile nav UX is Phase 5;
    // until then skip the nav-click test on smaller viewports.
    test.skip(
      !viewport || viewport.width < 861,
      'nav links are hidden below 861px; mobile nav UX lands in phase 5',
    );

    await page.goto('/');

    await page.getByRole('link', { name: 'Work', exact: true }).first().click();

    await expect(page).toHaveURL(/#work$/);
    const work = page.locator('#work');
    await expect(work).toBeInViewport({ ratio: 0.1 });
  });

  // PR-4 of the gap-analysis plan armed this gate (was test.fixme). Lighthouse
  // accessibility is 0.97 in the 2026-05-19 baseline — three nits short of
  // 1.0. If this surfaces non-trivial violations the gate stays armed and
  // the residue moves to a follow-up `fix(a11y)` PR.
  test('axe-core reports no WCAG A/AA violations on the landing page', async ({
    page,
  }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
