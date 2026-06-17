import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment berdasarkan NODE_ENV
const envFile =
  process.env.NODE_ENV === 'staging'
    ? '.env.staging'
    : '.env.production';

dotenv.config({ path: envFile });

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  reporter: [
    ['html'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL,

    actionTimeout: 10000,
    navigationTimeout: 30000,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1920,
      height: 1080,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});