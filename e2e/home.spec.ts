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

  test('nav anchor links scroll to the corresponding section', async ({ page }) => {
    await page.goto('/');

    // Click the "Work" nav link — it points to #work.
    await page.getByRole('link', { name: 'Work', exact: true }).first().click();

    await expect(page).toHaveURL(/#work$/);
    // Give scroll a moment to settle before asserting visibility without
    // relying on animation timing.
    const work = page.locator('#work');
    await expect(work).toBeInViewport({ ratio: 0.1 });
  });

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
