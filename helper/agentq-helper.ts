/**
 * =========================================================
 * AGENTQ PURE TOKEN CLIENT (NO LOGIN, NO SDK RELIANCE)
 * =========================================================
 */

const AGENTQ_TOKEN = process.env.AGENTQ_TOKEN;
const AGENTQ_TESTRUN_ID = process.env.AGENTQ_TESTRUN_ID;
const AGENTQ_ENABLE = process.env.AGENTQ_ENABLE === 'true';

/**
 * TC Mapping
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
 * DIRECT API CALL (NO LOGIN FLOW)
 * =========================================================
 */
async function sendToAgentQAPI(payload: any) {
  const res = await fetch(
    `https://backend-app.agentq.id/api/test-results`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AGENTQ_TOKEN}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AgentQ API error: ${res.status} - ${text}`);
  }

  return res.json();
}

/**
 * =========================================================
 * MAIN PUSH FUNCTION
 * =========================================================
 */
export async function pushTestResultToAgentQ(
  testTitle: string,
  status: string | undefined,
  executionTime: number,
  notes = '',
): Promise<void> {
  if (!AGENTQ_ENABLE) return;

  if (!AGENTQ_TOKEN || !AGENTQ_TESTRUN_ID) {
    console.warn('[AgentQ] Missing TOKEN or TESTRUN_ID');
    return;
  }

  try {
    const testCaseCode = testTitle.split(' - ')[0];
    const tcId = AGENTQ_TC_MAPPING[testCaseCode] ?? '0';

    const agentQStatus =
      status === 'passed'
        ? 'passed'
        : status === 'skipped'
          ? 'skipped'
          : 'failed';

    const payload = {
      testCaseId: tcId,
      testRunId: AGENTQ_TESTRUN_ID,
      status: agentQStatus,
      actualResult: status ?? 'failed',
      executionTime,
      notes: `${notes}\nTC_CODE=${testCaseCode}`,
    };

    await sendToAgentQAPI(payload);

    console.log(`[AgentQ] SENT OK: ${testCaseCode}`);
  } catch (error) {
    console.error('[AgentQ] PUSH FAILED:', error);
  }
}