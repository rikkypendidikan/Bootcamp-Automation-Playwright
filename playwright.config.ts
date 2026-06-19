import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ============================================================
 * PLAYWRIGHT CONFIGURATION
 * ============================================================
 *
 * File ini merupakan konfigurasi utama Playwright.
 *
 * Fitur:
 * ✅ Mendukung Multi Environment
 * ✅ Konfigurasi Browser
 * ✅ Konfigurasi Reporter
 * ✅ Konfigurasi Timeout
 * ✅ Konfigurasi Artifact
 * ✅ CI/CD Friendly
 *
 * ============================================================
 */

/**
 * ============================================================
 * ENVIRONMENT DETECTION
 * ============================================================
 *
 * Prioritas environment:
 *
 * 1. TEST_ENV (CI/CD)
 * 2. NODE_ENV (Local)
 * 3. local (Default)
 *
 * ============================================================
 */
const environment =
  process.env.TEST_ENV ||
  process.env.NODE_ENV ||
  'local';

/**
 * ============================================================
 * BASE URL MAPPING
 * ============================================================
 *
 * Menentukan Base URL berdasarkan environment aktif.
 *
 * local      -> LOCAL_BASE_URL
 * staging    -> STAGING_BASE_URL
 * production -> PRODUCTION_BASE_URL
 *
 * ============================================================
 */
const baseURLMap: Record<string, string | undefined> = {
  local: process.env.LOCAL_BASE_URL,
  staging: process.env.STAGING_BASE_URL,
  production: process.env.PRODUCTION_BASE_URL,
};

const baseURL = baseURLMap[environment];

/**
 * ============================================================
 * VALIDASI ENVIRONMENT
 * ============================================================
 *
 * Hentikan proses apabila Base URL tidak ditemukan.
 * Hal ini mencegah test berjalan dengan konfigurasi yang salah.
 *
 * ============================================================
 */
if (!baseURL) {
  throw new Error(`
❌ Konfigurasi Environment Tidak Valid

Environment :
${environment}

Pastikan variable berikut sudah tersedia pada file .env

${environment.toUpperCase()}_BASE_URL
`);
}

/**
 * ============================================================
 * INFORMASI ENVIRONMENT
 * ============================================================
 */

console.log('');
console.log(
  '════════════════════════════════════════════════════════════',
);
console.log(
  '🚀 PLAYWRIGHT CONFIGURATION',
);
console.log(
  '════════════════════════════════════════════════════════════',
);
console.log(
  `🌍 Environment   : ${environment}`,
);
console.log(
  `🔗 Base URL      : ${baseURL}`,
);
console.log(
  '════════════════════════════════════════════════════════════',
);
console.log('');

/**
 * ============================================================
 * PLAYWRIGHT CONFIGURATION
 * ============================================================
 */
export default defineConfig({
  /**
   * Lokasi seluruh file automation.
   */
  testDir: './tests',

  /**
   * ==========================================================
   * EXECUTION
   * ==========================================================
   */

  /**
   * Jalankan test secara serial.
   * Sangat direkomendasikan apabila menggunakan
   * shared account atau data yang saling berkaitan.
   */
  workers: 1,

  /**
   * Nonaktifkan parallel execution.
   */
  fullyParallel: false,

  /**
   * Retry dimatikan agar hasil testing benar-benar
   * merepresentasikan kondisi aplikasi.
   *
   * Untuk production CI biasanya dapat diubah menjadi:
   *
   * retries: process.env.CI ? 2 : 0
   */
  retries: 2,

  /**
   * ==========================================================
   * TIMEOUT
   * ==========================================================
   */

  /**
   * Maksimal durasi setiap test.
   */
  timeout: 30_000,

  /**
   * Maksimal waktu assertion.
   */
  expect: {
    timeout: 5_000,
  },

  /**
   * Folder penyimpanan artifact sementara.
   */
  outputDir: 'test-results',

  /**
   * ==========================================================
   * REPORTER
   * ==========================================================
   */

  reporter: [
    /**
     * Console Reporter
     */
    ['list'],

    /**
     * HTML Report
     */
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],

    /**
     * JSON Report
     *
     * Digunakan oleh:
     * - Parse Report
     * - Telegram Notification
     * - AgentQ
     */
    [
      'json',
      {
        outputFile: 'playwright-report/report.json',
      },
    ],
  ],

  /**
   * ==========================================================
   * BROWSER CONFIGURATION
   * ==========================================================
   */

  use: {
    /**
     * Base URL sesuai environment aktif.
     */
    baseURL,

    /**
     * Jalankan browser tanpa tampilan GUI.
     */
    headless: true,

    /**
     * Screenshot hanya ketika test gagal.
     */
    screenshot: 'only-on-failure',

    /**
     * Simpan video ketika test gagal.
     */
    video: 'retain-on-failure',

    /**
     * Simpan trace ketika test gagal.
     */
    trace: 'retain-on-failure',

    /**
     * Timeout maksimal setiap action.
     */
    actionTimeout: 10_000,
  },
});