import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'local';

const baseURL =
  env === 'production'
    ? process.env.PRODUCTION_BASE_URL
    : env === 'staging'
    ? process.env.STAGING_BASE_URL
    : process.env.LOCAL_BASE_URL;

if (!baseURL) {
  throw new Error(`❌ BASE_URL untuk "${env}" tidak ditemukan.`);
}

export default defineConfig({
  testDir: './tests',

  timeout: 30000,

  expect: { timeout: 5000 },

  fullyParallel: true,

  retries: 1,

  reporter: [
    ['list'],
    ['html'],
    [
      'json',
      {
        outputFile: 'playwright-report/report.json',
      },
    ],
  ],

  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10000,
  },
});