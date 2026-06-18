import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * =========================================================
 * LOAD ENV FILE (.env)
 * =========================================================
 * Semua konfigurasi environment (local, staging, production)
 * disimpan di file .env agar tidak hardcode di kode
 */
dotenv.config();

/**
 * =========================================================
 * MENENTUKAN ENVIRONMENT AKTIF
 * =========================================================
 * Default: 'local' jika NODE_ENV tidak diset
 */
const env = process.env.NODE_ENV || 'local';

/**
 * =========================================================
 * BASE URL SELECTION (AMANKAN SEMUA ENV)
 * =========================================================
 * Memilih URL berdasarkan environment aktif
 * - production → https://www.emra.chat
 * - staging → staging URL
 * - local → localhost
 */
const baseURL =
  env === 'staging'
    ? process.env.STAGING_BASE_URL
    : env === 'production'
      ? process.env.PROD_BASE_URL
      : process.env.LOCAL_BASE_URL || 'http://localhost:3000';

/**
 * =========================================================
 * VALIDASI BASE URL
 * =========================================================
 * Jika baseURL kosong, hentikan test agar error lebih jelas
 */
if (!baseURL) {
  throw new Error(
    `BASE_URL tidak ditemukan untuk environment: ${env}. Cek file .env kamu!`
  );
}

/**
 * =========================================================
 * PLAYWRIGHT CONFIGURATION
 * =========================================================
 */
export default defineConfig({
  testDir: './tests',

  /**
   * Jalankan test secara paralel (lebih cepat)
   */
  fullyParallel: true,

  /**
   * Retry jika test gagal (stabil untuk CI/CD)
   */
  retries: 2,

  /**
   * Timeout global semua test
   */
  timeout: 60000,

  /**
   * Timeout untuk expect assertion
   */
  expect: {
    timeout: 10000,
  },

  /**
   * Reporter hasil test
   */
  reporter: [['html'], ['allure-playwright']],

  /**
   * =========================================================
   * CONFIG GLOBAL UNTUK SEMUA TEST
   * =========================================================
   */
  use: {
    /**
     * Base URL untuk page.goto('/path')
     * Contoh: /signup → https://www.emra.chat/signup
     */
    baseURL,

    /**
     * Debugging tools
     */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    ignoreHTTPSErrors: true,

    /**
     * Ukuran browser
     */
    viewport: {
      width: 1920,
      height: 1080,
    },
  },

  /**
   * =========================================================
   * WEB SERVER
   * =========================================================
   * ❗ DIHAPUS / DINONAKTIFKAN
   *
   * Alasan:
   * - Kamu pakai production URL (bukan localhost)
   * - Tidak perlu menjalankan npm run dev
   * - Menghindari error "connection refused"
   */
  webServer: undefined,

  /**
   * =========================================================
   * BROWSER SETUP
   * =========================================================
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});