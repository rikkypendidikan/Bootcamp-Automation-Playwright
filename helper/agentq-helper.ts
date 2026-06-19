import { exportTestResult } from 'agentq-playwright/dist/testResult';

/**
 * =========================================================
 * AGENTQ CONFIG
 * =========================================================
 */
const AGENTQ_TOKEN = process.env.AGENTQ_TOKEN;
const AGENTQ_PROJECT_ID = process.env.AGENTQ_PROJECT_ID;
const AGENTQ_TESTRUN_ID = process.env.AGENTQ_TESTRUN_ID;

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
 * PUSH RESULT TO AGENTQ (NO LOGIN, TOKEN ONLY)
 * =========================================================
 */
export async function pushTestResultToAgentQ(
  testTitle: string,
  status: string | undefined,
  executionTime: number,
  notes = '',
): Promise<void> {

  /**
   * GLOBAL SWITCH
   */
  if (process.env.AGENTQ_ENABLE !== 'true') return;

  /**
   * REQUIRED ENV CHECK
   */
  if (!AGENTQ_TOKEN || !AGENTQ_TESTRUN_ID) {
    console.warn('[AgentQ] Missing TOKEN or TESTRUN_ID');
    return;
  }

  try {
    const testCaseCode = testTitle.split(' - ')[0];
    const tcId = AGENTQ_TC_MAPPING[testCaseCode] ?? '0';

    if (!AGENTQ_TC_MAPPING[testCaseCode]) {
      console.warn(`[AgentQ] Unmapped TC: ${testCaseCode} -> fallback 0`);
    }

    const agentQStatus =
      status === 'passed'
        ? 'passed'
        : status === 'skipped'
          ? 'skipped'
          : 'failed';

    /**
     * 🔥 IMPORTANT FIX:
     * Tidak ada login endpoint dipanggil sama sekali
     * hanya push result via token
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