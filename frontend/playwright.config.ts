import { defineConfig, devices } from '@playwright/test';

const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:5173';
const SLOWMO = Number(process.env.SLOWMO || 0); // e.g. SLOWMO=300
const WORKERS = process.env.WORKERS ? Number(process.env.WORKERS) : undefined; // e.g. WORKERS=1

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: WORKERS ?? 1,
  reporter: 'list',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: SLOWMO ? { slowMo: SLOWMO } : {},
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: FRONTEND_URL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
