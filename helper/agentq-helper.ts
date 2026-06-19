import { exportTestResult } from 'agentq-playwright/dist/testResult';

/**
 * =========================================================
 * AGENTQ CONFIG
 * =========================================================
 */
const AGENTQ_TOKEN = process.env.AGENTQ_TOKEN;
const AGENTQ_TESTRUN_ID = process.env.AGENTQ_TESTRUN_ID;

/**
 * =========================================================
 * SAFETY CHECK (CI ENV HARDENED)
 * =========================================================
 */
const isCI = process.env.CI === 'true';

/**
 * =========================================================
 * TC MAPPING
 * =========================================================
 */
const AGENTQ_TC_MAPPING: Record<string, string> = {
  TC_LOGIN_001: '1',
  TC_LOGIN_002: '2',
  TC_REGISTER_001: '3',
  TC_REGISTER_002: '4',
  TC_REGISTER_003: '5',
  TC_REGISTER_004: '6',
  TC_REGISTER_005: '7',
  TC_REGISTER_006: '8',
  TC_REGISTER_007: '9',
  TC_CONTACT_001: '10',
  TC_CONTACT_002: '11',
  TC_CONTACT_003: '12',
};

/**
 * =========================================================
 * PUSH RESULT TO AGENTQ (CI SAFE VERSION)
 * =========================================================
 */
export async function pushTestResultToAgentQ(
  testTitle: string,
  status: string | undefined,
  executionTime: number,
  notes = '',
): Promise<void> {

  /**
   * DISABLE IF NOT ENABLED
   */
  if (process.env.AGENTQ_ENABLE !== 'true') return;

  /**
   * REQUIRED CHECK
   */
  if (!AGENTQ_TOKEN || !AGENTQ_TESTRUN_ID) {
    console.warn('[AgentQ] Missing TOKEN or TESTRUN_ID');
    return;
  }

  /**
   * CI SAFETY GUARD
   * (avoid triggering auth flow / cloudflare login)
   */
  if (isCI && !AGENTQ_TOKEN.startsWith('ey')) {
    console.warn('[AgentQ] Invalid token format in CI');
    return;
  }

  try {
    const testCaseCode = testTitle.split(' - ')[0];
    const tcId = AGENTQ_TC_MAPPING[testCaseCode] ?? '0';

    if (!AGENTQ_TC_MAPPING[testCaseCode]) {
      console.warn(`[AgentQ] Unmapped TC: ${testCaseCode}`);
    }

    const agentQStatus =
      status === 'passed'
        ? 'passed'
        : status === 'skipped'
          ? 'skipped'
          : 'failed';

    /**
     * DIRECT API PUSH ONLY (NO LOGIN FLOW EVER)
     */
    await exportTestResult(
      tcId,
      AGENTQ_TESTRUN_ID,
      {
        status: agentQStatus,
        actualResult: status ?? 'failed',
        executionTime,
        notes: `${notes}\nTC_CODE=${testCaseCode}`,
      } as any
    );

    console.log(`[AgentQ] Sent OK: ${testCaseCode}`);

  } catch (error) {
    console.error('[AgentQ] ERROR send result:', error);
  }
}