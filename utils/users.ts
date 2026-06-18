/**
 * =========================================================
 * USER DATA WRAPPER (SECURE LAYER)
 * =========================================================
 * File ini digunakan sebagai jembatan antara test dan ENV
 * Semua credential diambil dari file .env
 * Tidak boleh ada hardcode password/email di test
 */

const env = process.env.NODE_ENV || 'local';

/**
 * Helper untuk mengambil nilai ENV dengan aman
 */
const getEnv = (key: string) => process.env[key] || '';

/**
 * =========================================================
 * USER OBJECT
 * =========================================================
 */
export const users = {
  /**
   * USER VALID (untuk login sukses)
   */
  valid: {
    email:
      env === 'staging'
        ? getEnv('STAGING_EMAIL')
        : env === 'production'
          ? getEnv('PROD_EMAIL')
          : getEnv('LOCAL_EMAIL'),

    password:
      env === 'staging'
        ? getEnv('STAGING_PASSWORD')
        : env === 'production'
          ? getEnv('PROD_PASSWORD')
          : getEnv('LOCAL_PASSWORD'),
  },

  /**
   * USER INVALID (untuk negative test)
   */
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!',
  },
};