import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 1,

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
    actionTimeout: 10000,

    navigationTimeout: 30000,

    // Capture artifacts when test fails
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
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});