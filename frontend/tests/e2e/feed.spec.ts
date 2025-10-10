import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:4000';

test.describe('Feed (requires backend, no mocks)', () => {
  test('health endpoint is up', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test('shows feed page (unauthenticated -> login)', async ({ page }) => {
    await page.goto('/feed');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('authenticated: loads feed', async ({ page }) => {
    test.skip(!process.env.PLAYWRIGHT_TOKEN, 'requires PLAYWRIGHT_TOKEN env var');
    // Inject token before app loads
    await page.addInitScript((token) => localStorage.setItem('token', token as string), process.env.PLAYWRIGHT_TOKEN);
    await page.goto('/feed');
    // Should render greeting even if there are no posts
    await expect(page.getByText(/Hello,/)).toBeVisible();
  });
});
