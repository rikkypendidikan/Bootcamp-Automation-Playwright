import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * =========================================================
 * LOAD ENV (.env) - ONLY FOR LOCAL DEVELOPMENT
 * =========================================================
 * Di CI (GitHub Actions), file .env biasanya tidak dipakai
 * jadi kita hanya load dotenv di local saja
 */
if (!process.env.CI) {
  dotenv.config();
}

/**
 * =========================================================
 * ENVIRONMENT DETECTION
 * =========================================================
 * CI → production (default aman untuk pipeline)
 * local → pakai NODE_ENV dari .env
 */
const env = process.env.NODE_ENV || (process.env.CI ? 'production' : 'local');

/**
 * =========================================================
 * BASE URL SELECTION
 * =========================================================
 * Mengambil URL berdasarkan environment aktif
 *
 * LOCAL      → LOCAL_BASE_URL
 * STAGING    → STAGING_BASE_URL
 * PRODUCTION → PROD_BASE_URL
 */
const baseURL =
  env === 'staging'
    ? process.env.STAGING_BASE_URL
    : env === 'production'
      ? process.env.PROD_BASE_URL
      : process.env.LOCAL_BASE_URL;

/**
 * =========================================================
 * SAFETY CHECK (FAIL FAST)
 * =========================================================
 * Jika baseURL tidak ada → langsung error jelas di CI
 */
if (!baseURL) {
  throw new Error(
    `❌ BASE_URL tidak ditemukan untuk environment: ${env}`
  );
}

/**
 * =========================================================
 * PLAYWRIGHT CONFIG
 * =========================================================
 */
export default defineConfig({
  testDir: './tests',

  /**
   * Jalankan test paralel
   */
  fullyParallel: true,

  /**
   * Retry untuk CI agar lebih stabil
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Timeout global test
   */
  timeout: 60000,

  /**
   * Assertion timeout
   */
  expect: {
    timeout: 10000,
  },

  /**
   * Reporter
   */
  reporter: [['html'], ['allure-playwright']],

  /**
   * GLOBAL TEST CONFIG
   */
  use: {
    baseURL,

    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1920,
      height: 1080,
    },
  },

  /**
   * BROWSER CONFIG
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});