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

  // PR-4 of the gap-analysis plan un-fixmed this gate and immediately
  // surfaced ~30 contrast violations across the home page (every
  // expectedContrastRatio: "4.5:1" finding). Per the plan §1.6 risks
  // ("axe violations cascade"), the residue exceeds the 30-min inline
  // budget, so the fixme is restored and the work moves to a follow-up
  // `fix(a11y)` PR tracked in ROADMAP. Re-arm by deleting the fixme line
  // once the contrast pass lands.
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
