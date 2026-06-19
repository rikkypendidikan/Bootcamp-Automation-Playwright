import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * =========================================================
 * ACTIVE ENVIRONMENT
 * =========================================================
 *
 * Prioritas:
 * 1. TEST_ENV
 * 2. NODE_ENV
 * 3. local
 *
 */

const environment =
  process.env.TEST_ENV ||
  process.env.NODE_ENV ||
  'local';

/**
 * =========================================================
 * BASE URL MAPPING
 * =========================================================
 */

const baseURL =
  environment === 'production'
    ? process.env.PRODUCTION_BASE_URL
    : environment === 'staging'
      ? process.env.STAGING_BASE_URL
      : process.env.LOCAL_BASE_URL;

/**
 * Validasi Base URL
 */

if (!baseURL) {
  throw new Error(
    `❌ BASE_URL untuk environment "${environment}" tidak ditemukan.`,
  );
}

export default defineConfig({
  testDir: './tests',

  outputDir: 'test-results',

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,

  retries: 2,

  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder:
          'playwright-report',
        open: 'never',
      },
    ],

    [
      'json',
      {
        outputFile:
          'playwright-report/report.json',
      },
    ],
  ],

  use: {
    /**
     * URL aplikasi sesuai environment
     */
    baseURL,

    /**
     * Browser mode
     * true  = headless
     * false = headed
     */
    headless: true,

    /**
     * Artifact otomatis ketika gagal
     */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    /**
     * Timeout setiap action Playwright
     */
    actionTimeout: 10_000,
  },
});