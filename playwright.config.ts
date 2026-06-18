import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// =========================================================
// 🌍 ENVIRONMENT DETECTION
// =========================================================
const env = process.env.NODE_ENV || 'local';

// =========================================================
// 🔗 BASE URL RESOLVER
// =========================================================
const baseURL = (() => {
  switch (env) {
    case 'local':
      return process.env.LOCAL_BASE_URL;
    case 'staging':
      return process.env.STAGING_BASE_URL;
    case 'production':
      return process.env.PRODUCTION_BASE_URL;
    default:
      return process.env.LOCAL_BASE_URL;
  }
})();

if (!baseURL) {
  throw new Error(`❌ BASE_URL tidak ditemukan untuk environment: ${env}`);
}

// =========================================================
// 🎭 PLAYWRIGHT CONFIG
// =========================================================
export default defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  fullyParallel: true,

  retries: 2, // 🔁 retry kalau gagal (CI lebih stabil)

  reporter: [
    ['html'],
    ['list']
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