import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'local';

function getBaseURL() {
  switch (env) {
    case 'local':
      return process.env.LOCAL_BASE_URL;

    case 'staging':
      return process.env.STAGING_BASE_URL;

    case 'production':
    case 'prod':
      return process.env.PROD_BASE_URL;

    case 'test':
      return process.env.PROD_BASE_URL;

    default:
      return process.env.LOCAL_BASE_URL;
  }
}

const baseURL = getBaseURL();

if (!baseURL) {
  throw new Error(`❌ BASE_URL tidak ditemukan untuk environment: ${env}`);
}

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  timeout: 30000,

  expect: {
    timeout: 10000,
  },
});