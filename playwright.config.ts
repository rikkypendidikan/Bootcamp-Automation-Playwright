import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * =========================================================
 * 🌍 LOAD ENV FILE
 * =========================================================
 * Wajib supaya .env terbaca di local & CI/CD
 */
dotenv.config();

/**
 * =========================================================
 * 🌍 DETEKSI ENVIRONMENT
 * =========================================================
 * default = local kalau NODE_ENV tidak diset
 */
const ENV = process.env.NODE_ENV || 'local';

/**
 * =========================================================
 * 🔎 MAPPING BASE URL PER ENV
 * =========================================================
 */
const BASE_URL_MAP: Record<string, string | undefined> = {
  local: process.env.LOCAL_BASE_URL,
  staging: process.env.STAGING_BASE_URL,
  production: process.env.PRODUCTION_BASE_URL,
};

/**
 * =========================================================
 * ❗ VALIDASI BASE URL (FAIL FAST)
 * =========================================================
 * Kalau tidak ditemukan → langsung error jelas
 */
const baseURL = BASE_URL_MAP[ENV];

if (!baseURL) {
  throw new Error(
    `❌ BASE_URL tidak ditemukan untuk environment: ${ENV}`
  );
}

console.log(`✅ ENV aktif: ${ENV}`);
console.log(`🌐 BASE URL: ${baseURL}`);

export default defineConfig({
  /**
   * =========================================================
   * 📁 TEST DIRECTORY
   * =========================================================
   */
  testDir: './tests',

  /**
   * =========================================================
   * 🌐 GLOBAL TEST SETTINGS
   * =========================================================
   */
  use: {
    baseURL,

    // Screenshot hanya kalau gagal
    screenshot: 'only-on-failure',

    // Trace hanya saat retry pertama
    trace: 'on-first-retry',

    // Video hanya kalau gagal (hemat storage CI)
    video: 'retain-on-failure',

    // Timeout default action & navigation
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /**
   * =========================================================
   * 🧪 TEST EXECUTION SETTINGS
   * =========================================================
   */
  timeout: 60 * 1000,

  expect: {
    timeout: 10000,
  },

  /**
   * =========================================================
   * 🔁 RETRY CONFIG (INI YANG KAMU TANYA)
   * =========================================================
   * Retry 2x kalau test gagal (stabil untuk CI/CD)
   */
  retries: 2,

  /**
   * =========================================================
   * 🧵 PARALLEL / STABILITY CI
   * =========================================================
   * CI lebih stabil pakai 1 worker
   */
  workers: 1,
  fullyParallel: false,

  /**
   * =========================================================
   * 📊 REPORTER
   * =========================================================
   */
  reporter: [
    ['html'],
    ['list']
  ],
});