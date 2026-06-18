import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment aktif
 * local | staging | production
 */
const env =
  process.env.TEST_ENV ||
  process.env.NODE_ENV ||
  'local';

/**
 * Mapping Base URL berdasarkan environment
 */
const baseURL =
  env === 'production'
    ? process.env.PRODUCTION_BASE_URL
    : env === 'staging'
      ? process.env.STAGING_BASE_URL
      : process.env.LOCAL_BASE_URL;

/**
 * Hentikan test jika Base URL tidak ditemukan
 */
if (!baseURL) {
  throw new Error(
    `❌ BASE_URL untuk environment "${env}" tidak ditemukan.`,
  );
}

export default defineConfig({
  /**
   * Folder test
   */
  testDir: './tests',

  /**
   * Folder hasil test
   * Berisi screenshot, video, trace, dll
   */
  outputDir: 'test-results',

  /**
   * Timeout per test
   */
  timeout: 30000,

  /**
   * Timeout expect()
   */
  expect: {
    timeout: 5000,
  },

  /**
   * Jalankan paralel
   */
  fullyParallel: true,

  /**
   * Retry jika gagal
   */
  retries: 2,

  /**
   * Reporter
   */
  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],

    [
      'json',
      {
        outputFile: 'playwright-report/report.json',
      },
    ],
  ],

  use: {
    /**
     * Base URL sesuai environment
     */
    baseURL,

    /**
     * Headless untuk CI/CD
     */
    headless: true,

    /**
     * Screenshot otomatis jika gagal
     */
    screenshot: 'only-on-failure',

    /**
     * Simpan video jika gagal
     */
    video: 'retain-on-failure',

    /**
     * Simpan trace jika gagal
     */
    trace: 'retain-on-failure',

    /**
     * Timeout action
     */
    actionTimeout: 10000,
  },
});