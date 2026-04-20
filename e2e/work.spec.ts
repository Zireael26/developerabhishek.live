import { test, expect } from '@playwright/test';

test.describe('Work — cards and detail routes', () => {
  test('home page lists all four case-study cards', async ({ page }) => {
    await page.goto('/');

    for (const slug of ['neev', 'vericite', 'bluehost-agents', 'curat-money']) {
      await expect(page.locator(`#case-${slug}`)).toBeVisible();
    }
  });

  test('Neev card links to /work/neev and the detail page renders', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#case-neev').getByRole('link', { name: /Read the case study/i }).click();

    await expect(page).toHaveURL(/\/work\/neev$/);

    // MDX owns the title + dek (per Phase 2 review fix). The H1 lives inside
    // the article, not the JSX header, so target the article scope.
    const article = page.locator('article.work-detail-body');
    await expect(article.getByRole('heading', { level: 1 })).toContainText('Neev');

    // Spec DL from frontmatter is still in the JSX header.
    await expect(page.locator('dl.case-spec')).toBeVisible();
  });

  test('Bluehost stub renders the confidentiality paragraph', async ({ page }) => {
    await page.goto('/work/bluehost-agents');

    const article = page.locator('article.work-detail-body');
    await expect(article).toContainText(/under scope review/i);
    await expect(article).toContainText('hello@akaushik.org');
  });
});
