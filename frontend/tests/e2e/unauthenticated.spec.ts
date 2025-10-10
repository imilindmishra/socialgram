import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to login from /feed', async ({ page }) => {
  await page.goto('/feed');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
});

test('login button points to backend google auth', async ({ page }) => {
  await page.goto('/login');
  const btn = page.getByRole('button', { name: /continue with google/i });
  await expect(btn).toBeVisible();
});

