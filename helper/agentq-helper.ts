import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * =========================================================
 * AGENTQ CONFIGURATION
 * =========================================================
 * Semua konfigurasi diambil dari environment variable.
 * Jangan pernah log credential sensitif ke console / CI log.
 */

const AGENTQ_ENABLED = process.env.AGENTQ_ENABLE === 'true';

const AGENTQ_API_URL =
  process.env.AGENTQ_API_URL || 'https://backend-app.agentq.id';

const AGENTQ_PROJECT_ID = process.env.AGENTQ_PROJECT_ID;
const AGENTQ_TESTRUN_ID = process.env.AGENTQ_TESTRUN_ID;

const AGENTQ_EMAIL = process.env.AGENTQ_EMAIL;
const AGENTQ_PASSWORD = process.env.AGENTQ_PASSWORD;

/**
 * Validasi minimal config penting agar tidak silent fail
 * (lebih aman daripada langsung crash tanpa info jelas)
 */
if (AGENTQ_ENABLED) {
  if (!AGENTQ_PROJECT_ID || !AGENTQ_TESTRUN_ID) {
    throw new Error('[AGENTQ] PROJECT_ID / TESTRUN_ID belum diset di .env');
  }

  if (!AGENTQ_EMAIL || !AGENTQ_PASSWORD) {
    throw new Error('[AGENTQ] EMAIL / PASSWORD belum diset di .env');
  }
}

/**
 * =========================================================
 * TEST CASE MAPPING
 * =========================================================
 * Mapping dari nama test case (string) ke ID AgentQ.
 * Dipakai untuk menghubungkan Playwright test dengan AgentQ TC ID.
 */
const TESTCASE_MAP: Record<string, number> = {
  TC_LOGIN_001: 1,
  TC_LOGIN_002: 2,

  TC_REGISTER_001: 3,
  TC_REGISTER_002: 4,
  TC_REGISTER_003: 5,
  TC_REGISTER_004: 6,
  TC_REGISTER_005: 7,
  TC_REGISTER_006: 8,
  TC_REGISTER_007: 9,

  TC_CONTACT_001: 10,
  TC_CONTACT_002: 11,
  TC_CONTACT_003: 12,
};

/**
 * Cache token agar login ke AgentQ hanya dilakukan 1x
 * selama 1 test run (menghemat waktu & request).
 */
let accessToken: string | null = null;

/**
 * =========================================================
 * SIMPLE LOGGER (biar log lebih rapi & konsisten)
 * =========================================================
 */
function logBlock(title: string, icon = 'ℹ️') {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`${icon} ${title}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * =========================================================
 * LOGIN AGENTQ (AMBIL ACCESS TOKEN)
 * =========================================================
 */
async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;

  logBlock('AGENTQ AUTHENTICATION', '🔐');

  try {
    const response = await axios.post(
      `${AGENTQ_API_URL}/auth/login`,
      {
        email: AGENTQ_EMAIL,
        password: AGENTQ_PASSWORD,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    accessToken = response.data?.access_token;

    if (!accessToken) {
      throw new Error('[AGENTQ] access_token tidak ditemukan dari response');
    }

    console.log('✅ Authentication berhasil');
    console.log('Token berhasil di-cache (tidak akan login ulang)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return accessToken;
  } catch (error: any) {
    console.log('❌ Authentication gagal');

    if (error?.response) {
      console.log(`HTTP ${error.response.status}`);
    }

    console.log(error?.message || error);
    throw error;
  }
}

/**
 * =========================================================
 * EXTRACT TEST CASE ID
 * =========================================================
 */
function extractTestCaseId(title: string): number | null {
  const testCaseKey = Object.keys(TESTCASE_MAP).find(tc =>
    title.includes(tc),
  );

  if (!testCaseKey) {
    logBlock('AGENTQ TESTCASE NOT FOUND', '⚠️');
    console.log(`📄 Test: ${title}`);
    console.log('⚠️ Pastikan nama TC sesuai mapping TESTCASE_MAP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return null;
  }

  return TESTCASE_MAP[testCaseKey];
}

/**
 * =========================================================
 * PUSH RESULT KE AGENTQ
 * =========================================================
 */
export async function pushTestResultToAgentQ(
  title: string,
  status: string | undefined,
  duration: number,
  errors = '',
): Promise<void> {
  try {
    if (!AGENTQ_ENABLED) return;

    const testCaseId = extractTestCaseId(title);

    logBlock('AGENTQ TEST RECEIVED', '🎯');
    console.log(`📄 Test     : ${title}`);
    console.log(`🆔 TC ID    : ${testCaseId ?? 'NOT FOUND'}`);

    if (!testCaseId) return;

    const token = await getAccessToken();

    const executionTime = Number((duration / 1000).toFixed(2));

    const payload = {
      status: status === 'passed' ? 'passed' : 'failed',

      actualResult:
        status === 'passed'
          ? 'Test executed successfully'
          : 'Test execution failed',

      executionTime,

      notes:
        status === 'passed'
          ? 'Executed by Playwright Automation'
          : errors,
    };

    logBlock('AGENTQ SYNC', '🚀');
    console.log(`🆔 TC        : ${testCaseId}`);
    console.log(`📊 Status    : ${status?.toUpperCase()}`);
    console.log(`⏱ Time      : ${executionTime}s`);

    const response = await axios.patch(
      `${AGENTQ_API_URL}/projects/${AGENTQ_PROJECT_ID}/test-runs/${AGENTQ_TESTRUN_ID}/test-results/tcId/${testCaseId}`,
      payload,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    );

    logBlock('AGENTQ RESPONSE', '📥');
    console.log(`HTTP STATUS  : ${response.status}`);
    console.log(`RESULT       : ${response.data?.status?.toUpperCase()}`);
    console.log(`MESSAGE      : ${response.data?.actualResult}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error: any) {
    logBlock('AGENTQ SYNC FAILED', '❌');

    if (error?.response) {
      console.log(`HTTP STATUS : ${error.response.status}`);

      // Hindari dump terlalu besar di CI log
      console.log(
        'Response    :',
        JSON.stringify(error.response.data)?.slice(0, 500),
      );
    } else {
      console.log(error?.message || error);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}