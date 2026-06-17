/**
 * Centralized test credentials
 * NOTE:
 * - Gunakan ENV, jangan hardcode password di test
 * - Support staging & production
 */

export const users = {
  valid: {
    email: process.env.EMAIL ?? '',
    password: process.env.PASSWORD ?? '',
  },

  invalid: {
    email: 'invalid@example.com',
    password: 'InvalidPassword123!',
  },
};