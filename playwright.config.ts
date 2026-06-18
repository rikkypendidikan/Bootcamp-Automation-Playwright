import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * =========================================================
 * ENVIRONMENT DETECTION
 * =========================================================
 */
const env = process.env.NODE_ENV || 'local';

/**
 * =========================================================
 * BASE URL RESOLVER
 * =========================================================
 */
const baseURL =
  env === 'production'
    ? process.env.PRODUCTION_BASE_URL
    : env === 'staging'
      ? process.env.STAGING_BASE_URL
      : process.env.LOCAL_BASE_URL;

if (!baseURL) {
  throw new Error(`❌ BASE_URL untuk "${env}" tidak ditemukan.`);
}

/**
 * =========================================================
 * PLAYWRIGHT CONFIGURATION
 * =========================================================
 */
export default defineConfig({

  /**
   * Folder test
   */
  testDir: './tests',

  /**
   * Timeout setiap test
   */
  timeout: 30 * 1000,

  /**
   * Timeout assertion
   */
  expect: {
    timeout: 5000,
  },

  /**
   * Jalankan test secara parallel
   */
  fullyParallel: true,

  /**
   * Retry jika gagal
   */
  retries: 2,

  /**
   * =========================================================
   * REPORTER
   *
   * html
   *  -> report HTML
   *
   * list
   *  -> output terminal
   *
   * json
   *  -> dipakai parser Telegram Notification
   * =========================================================
   */
  reporter: [
    ['html'],

    ['list'],

    [
      'json',
      {
        outputFile: 'test-results/results.json',
      },
    ],
  ],

  /**
   * =========================================================
   * PLAYWRIGHT OPTIONS
   * =========================================================
   */
  use: {

    /**
     * Base URL sesuai environment
     */
    baseURL,

    /**
     * Headless Browser
     */
    headless: true,

    /**
     * Screenshot hanya jika gagal
     */
    screenshot: 'only-on-failure',

    /**
     * Video hanya jika gagal
     */
    video: 'retain-on-failure',

    /**
     * Simpan trace ketika retry pertama
     */
    trace: 'on-first-retry',

    /**
     * Timeout setiap action
     */
    actionTimeout: 10000,
  },
});