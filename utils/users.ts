/**
 * =========================================================
 * USER DATA WRAPPER (SECURE LAYER)
 * =========================================================
 * File ini digunakan sebagai jembatan antara test dan ENV.
 * Semua credential diambil dari file .env.
 * Tidak boleh ada hardcode email/password di test.
 */

const env = process.env.NODE_ENV || 'local';

/**
 * Helper mengambil ENV.
 * Mengembalikan string kosong jika tidak ditemukan.
 */
const getEnv = (key: string): string => process.env[key] ?? '';

/**
 * =========================================================
 * USER OBJECT
 * =========================================================
 */
export const users = {
  /**
   * USER VALID
   */
  valid: {
    email:
      env === 'staging'
        ? getEnv('STAGING_EMAIL')
        : env === 'production'
          // ✅ sesuai nama variable di .env
          ? getEnv('PRODUCTION_EMAIL')
          : getEnv('LOCAL_EMAIL'),

    password:
      env === 'staging'
        ? getEnv('STAGING_PASSWORD')
        : env === 'production'
          // ✅ sesuai nama variable di .env
          ? getEnv('PRODUCTION_PASSWORD')
          : getEnv('LOCAL_PASSWORD'),
  },

  /**
   * USER INVALID
   */
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!',
  },
};