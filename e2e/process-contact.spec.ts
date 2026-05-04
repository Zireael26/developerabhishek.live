import { expect, test } from '@playwright/test';

const GITHUB_BLOB =
  'https://github.com/Zireael26/akaushik.org/blob/main';

test.describe('Process and contact affordances', () => {
  test('about section uses the real portrait asset', async ({ page }) => {
    await page.goto('/');

    const about = page.locator('#about');
    const portrait = about.getByRole('img', {
      name: /portrait of abhishek kaushik/i,
    });

    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute(
      'src',
      /\/_next\/image\?url=%2Fimages%2Fabout%2Fabhishek\.webp/,
    );
    await expect(about.locator('.placeholder-portrait')).toHaveCount(0);
  });

  test('site chrome keeps section links rooted from subpages', async ({
    page,
    viewport,
  }) => {
    test.skip(
      !viewport || viewport.width < 861,
      'desktop section nav links are hidden below 861px; home.spec covers the same responsive contract',
    );

    await page.goto('/writing/micrograd-makemore');

    const banner = page.getByRole('banner');

    await expect(
      banner.getByRole('link', { name: /abhishek kaushik, home/i }),
    ).toHaveAttribute('href', '/#top');
    await expect(banner.getByRole('link', { name: 'Work' })).toHaveAttribute(
      'href',
      '/#work',
    );
    await expect(
      banner.getByRole('link', { name: 'Process' }),
    ).toHaveAttribute('href', '/#process');
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: '/process' }),
    ).toHaveAttribute('href', '/#process');

    await banner.getByRole('link', { name: 'Work' }).click();

    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator('#work')).toBeInViewport();
  });

  test('process artifacts link to public routes or durable GitHub blobs', async ({
    page,
  }) => {
    await page.goto('/');

    const process = page.locator('#process');
    const artifacts = [
      {
        name: 'PRD.md',
        href: `${GITHUB_BLOB}/docs/PRD.md`,
      },
      {
        name: 'ADR-0001-stack.md',
        href: `${GITHUB_BLOB}/docs/adr/0001-nextjs-over-sveltekit.md`,
      },
      {
        name: 'ROADMAP.md',
        href: `${GITHUB_BLOB}/docs/ROADMAP.md`,
      },
      {
        name: 'AGENT_READINESS.md',
        href: `${GITHUB_BLOB}/docs/AGENT_READINESS.md`,
      },
      {
        name: 'CHANGELOG.md',
        href: `${GITHUB_BLOB}/docs/CHANGELOG.md`,
      },
      {
        name: '/llms-full.txt',
        href: 'https://akaushik.org/llms-full.txt',
      },
    ];

    for (const artifact of artifacts) {
      await expect(
        process.getByRole('link', { name: new RegExp(artifact.name) }),
      ).toHaveAttribute('href', artifact.href);
    }

    await expect(process.locator('a[href="#"]')).toHaveCount(0);
  });

  test('contact calendar placeholder is intentionally unavailable', async ({
    page,
  }) => {
    await page.goto('/');

    const contact = page.locator('#contact');

    await expect(
      contact.getByRole('link', { name: /book a 20-minute call/i }),
    ).toHaveCount(0);

    const calendar = contact.getByRole('button', {
      name: /book a 20-minute call/i,
    });
    await expect(calendar).toBeDisabled();
    await expect(calendar).toHaveAttribute('aria-disabled', 'true');
    await expect(calendar).toContainText('Calendar pending');
  });
});
