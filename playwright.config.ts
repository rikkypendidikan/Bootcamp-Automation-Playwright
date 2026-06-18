import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * =========================================================
 * ENV DETECTION
 * =========================================================
 */
const env = process.env.NODE_ENV || 'local';

/**
 * Ambil BASE URL sesuai environment
 */
const baseURLMap: Record<string, string | undefined> = {
  local: process.env.LOCAL_BASE_URL,
  staging: process.env.STAGING_BASE_URL,
  production: process.env.PRODUCTION_BASE_URL,
};

const baseURL = baseURLMap[env];

if (!baseURL) {
  throw new Error(`❌ BASE_URL untuk environment "${env}" tidak ditemukan.`);
}

export default defineConfig({
  testDir: './tests',

  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  fullyParallel: true,

  retries: 2,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
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