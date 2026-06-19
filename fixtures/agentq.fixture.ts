import {
  test as base,
  expect,
} from '@playwright/test';

import { pushTestResultToAgentQ }
  from '../helper/agentq-helper';

export { expect };

/**
 * =========================================================
 * CUSTOM PLAYWRIGHT FIXTURE
 * =========================================================
 *
 * Fixture ini digunakan sebagai
 * wrapper Playwright default.
 *
 * Tujuannya:
 * - Menjalankan test normal
 * - Mengirim hasil test otomatis
 *   ke AgentQ setelah test selesai
 *
 */

export const test = base.extend({});

/**
 * =========================================================
 * AFTER EACH TEST
 * =========================================================
 *
 * Akan berjalan otomatis setiap
 * test selesai.
 *
 * Mengirim:
 * - Nama test
 * - Status test
 * - Durasi test
 * - Error message
 *
 */

test.afterEach(
  async ({}, testInfo) => {
    const errors =
      testInfo.errors
        .map(
          error =>
            error.message || '',
        )
        .join('\n');

    await pushTestResultToAgentQ(
      testInfo.title,
      testInfo.status,
      testInfo.duration,
      errors,
    );
  },
);