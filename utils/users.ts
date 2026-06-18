/**
 * =========================================================
 * USER DATA WRAPPER (SECURE LAYER)
 * =========================================================
 * Semua credential diambil dari Environment Variable.
 * Local -> .env
 * GitHub Actions -> Repository Secrets
 */

import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'local';

const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`❌ Environment variable "${key}" tidak ditemukan.`);
  }

  return value;
};

export const users = {
  valid: {
    email:
      env === 'staging'
        ? getEnv('STAGING_EMAIL')
        : env === 'production'
        ? getEnv('PRODUCTION_EMAIL')
        : getEnv('LOCAL_EMAIL'),

    password:
      env === 'staging'
        ? getEnv('STAGING_PASSWORD')
        : env === 'production'
        ? getEnv('PRODUCTION_PASSWORD')
        : getEnv('LOCAL_PASSWORD'),
  },

  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!',
  },
};