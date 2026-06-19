import { test as base } from '@playwright/test';
import { pushTestResultToAgentQ } from '../helper/agentq-helper';

/**
 * =========================================================
 * FIXTURE AGENTQ
 * =========================================================
 *
 * Fixture ini bertugas mengirim hasil test ke AgentQ
 * setelah test selesai dieksekusi.
 *
 * Dengan fixture ini kita tidak perlu menulis
 * test.afterEach() di setiap file test.
 */
export const test = base;

test.afterEach(async ({}, testInfo) => {

  const executionTime = testInfo.duration;

  const notes = testInfo.errors
    .map(error => error.message)
    .join('\n');

  await pushTestResultToAgentQ(
    testInfo.title,
    testInfo.status,
    executionTime,
    notes,
  );

});

export { expect } from '@playwright/test';