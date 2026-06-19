import { test as base } from '@playwright/test';
import { pushTestResultToAgentQ } from '../helper/agentq-helper';

export const test = base;

test.afterEach(async ({}, testInfo) => {
  const executionTime = testInfo.duration;

  const notes = testInfo.errors
    .map((error) => error.message)
    .join('\n');

  await pushTestResultToAgentQ(
    testInfo.title,
    testInfo.status,
    executionTime,
    notes,
  );
});

export { expect } from '@playwright/test';