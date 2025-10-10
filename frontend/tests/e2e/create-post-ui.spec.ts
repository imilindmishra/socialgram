import { test, expect } from '@playwright/test';

// Skips if no token or Cloudinary env is missing
const needsEnv = () => {
  const token = process.env.PLAYWRIGHT_TOKEN;
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return !token || !cloudName || !uploadPreset;
};

// 1x1 transparent PNG
const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
  'base64'
);

test('create post via UI and see it on feed', async ({ page }) => {
  test.skip(needsEnv(), 'Requires PLAYWRIGHT_TOKEN and Cloudinary env (VITE_CLOUDINARY_*)');

  const caption = `e2e ui post ${Date.now()}`;

  // Inject token before app loads
  await page.addInitScript((token) => localStorage.setItem('token', token as string), process.env.PLAYWRIGHT_TOKEN);

  await page.goto('/create');

  await page.getByPlaceholder('Write a caption...').fill(caption);

  await page.setInputFiles('input[type="file"]', {
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: TINY_PNG,
  });

  await page.getByRole('button', { name: /^post$/i }).click();

  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByText(caption)).toBeVisible();
});

