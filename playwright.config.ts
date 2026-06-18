import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Load environment variable dari .env
 */
dotenv.config();

/**
 * Menentukan environment aktif
 * Default = local
 */
const env = process.env.NODE_ENV || 'local';

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
 * Hentikan eksekusi jika BASE_URL tidak ditemukan
 */
if (!baseURL) {
  throw new Error(
    `❌ BASE_URL untuk environment "${env}" tidak ditemukan.`,
  );
}

export default defineConfig({
  /**
   * Lokasi file test
   */
  testDir: './tests',

  /**
   * Timeout maksimal per test
   */
  timeout: 30000,

  /**
   * Timeout untuk assertion expect()
   */
  expect: {
    timeout: 5000,
  },

  /**
   * Menjalankan test secara paralel
   */
  fullyParallel: true,

  /**
   * Retry 1x jika gagal
   */
  retries: 1,

  /**
   * Reporter yang digunakan
   */
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
    /**
     * Base URL sesuai environment
     */
    baseURL,

    /**
     * Jalankan browser headless di CI
     */
    headless: true,

    /**
     * Screenshot hanya ketika gagal
     */
    screenshot: 'only-on-failure',

    /**
     * Simpan video ketika gagal
     */
    video: 'retain-on-failure',

    /**
     * Simpan trace pada retry pertama
     */
    trace: 'on-first-retry',

    /**
     * Timeout action (click/fill dsb)
     */
    actionTimeout: 10000,
  },
});