import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:4000';

test.describe('like and comment flow', () => {
  test('like and comment on a post', async ({ page, request }) => {
    test.skip(!process.env.PLAYWRIGHT_TOKEN, 'requires PLAYWRIGHT_TOKEN env var');

    const caption = `e2e like/comment ${Date.now()}`;

    // Create a post via API using the token (no mocks)
    const res = await request.post(`${API_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${process.env.PLAYWRIGHT_TOKEN}` },
      data: {
        caption,
        imageUrl: 'https://picsum.photos/seed/e2e-like-comment/800/500',
      },
    });
    expect(res.ok()).toBeTruthy();

    // Inject token before app loads
    await page.addInitScript((token) => localStorage.setItem('token', token as string), process.env.PLAYWRIGHT_TOKEN);

    await page.goto('/feed');

    const card = page.locator('article', { hasText: caption });
    await expect(card).toBeVisible();

    // Toggle like -> expect count to increase to 1
    await card.getByRole('button', { name: /like/i }).click();
    await expect(card.getByText(/1 likes/)).toBeVisible();

    // Open comments, add a comment, and assert it appears
    await card.getByRole('button', { name: /view comments/i }).click();
    const input = card.getByPlaceholder(/add a comment/i);
    await input.fill('Nice from E2E!');
    await card.getByRole('button', { name: /^post$/i }).click();
    await expect(card.getByText('Nice from E2E!')).toBeVisible();
  });
});

