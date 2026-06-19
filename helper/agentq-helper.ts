import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * =========================================================
 * AGENTQ CONFIGURATION
 * =========================================================
 */

const AGENTQ_ENABLED =
  process.env.AGENTQ_ENABLE === 'true';

const AGENTQ_API_URL =
  process.env.AGENTQ_API_URL ||
  'https://backend-app.agentq.id';

const AGENTQ_PROJECT_ID =
  process.env.AGENTQ_PROJECT_ID!;

const AGENTQ_TESTRUN_ID =
  process.env.AGENTQ_TESTRUN_ID!;

const AGENTQ_EMAIL =
  process.env.AGENTQ_EMAIL!;

const AGENTQ_PASSWORD =
  process.env.AGENTQ_PASSWORD!;

/**
 * =========================================================
 * TEST CASE MAPPING
 * =========================================================
 *
 * Mapping antara title test Playwright
 * dengan Test Case ID yang ada di AgentQ.
 *
 * Contoh:
 *
 * TC_LOGIN_001
 * ↓
 * AgentQ TC ID = 1
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
 * Cache access token agar login AgentQ
 * hanya dilakukan sekali selama test run.
 */
let accessToken: string | null = null;

/**
 * =========================================================
 * LOGIN KE AGENTQ
 * =========================================================
 *
 * Mengambil access token dari AgentQ.
 * Token akan disimpan agar tidak perlu
 * login ulang pada setiap test.
 */

async function getAccessToken(): Promise<string> {
  if (accessToken) {
    return accessToken;
  }
console.log('AgentQ URL:', AGENTQ_API_URL);
console.log('AgentQ Email:', AGENTQ_EMAIL);
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
    },
  );

  accessToken = response.data.access_token;

  if (!accessToken) {
    throw new Error(
      '❌ AgentQ access token tidak ditemukan.',
    );
  }

  return accessToken;
}

/**
 * =========================================================
 * CARI TEST CASE ID
 * =========================================================
 *
 * Mengambil Test Case ID AgentQ
 * berdasarkan title test Playwright.
 *
 * Contoh:
 *
 * TC_LOGIN_001 - Positive - Login Success
 *
 * hasil:
 *
 * 1
 */

function extractTestCaseId(
  title: string,
): number | null {
  const testCaseKey = Object.keys(
    TESTCASE_MAP,
  ).find(tc => title.includes(tc));

  if (!testCaseKey) {
    console.warn(
      `⚠️ AgentQ Mapping tidak ditemukan untuk test: ${title}`,
    );

    return null;
  }

  return TESTCASE_MAP[testCaseKey];
}

/**
 * =========================================================
 * PUSH TEST RESULT KE AGENTQ
 * =========================================================
 *
 * Dipanggil otomatis oleh Playwright
 * setelah test selesai.
 *
 * Data yang dikirim:
 * - Status test
 * - Durasi test
 * - Error message
 */

export async function pushTestResultToAgentQ(
  title: string,
  status: string | undefined,
  duration: number,
  errors = '',
): Promise<void> {
  try {
    /**
     * Skip jika AgentQ dinonaktifkan.
     */
    if (!AGENTQ_ENABLED) {
      return;
    }

    const testCaseId =
      extractTestCaseId(title);

    if (!testCaseId) {
      return;
    }

    const token =
      await getAccessToken();

    await axios.patch(
      `${AGENTQ_API_URL}/projects/${AGENTQ_PROJECT_ID}/test-runs/${AGENTQ_TESTRUN_ID}/test-results/tcId/${testCaseId}`,
      {
        status:
          status === 'passed'
            ? 'passed'
            : 'failed',

        actualResult:
          status === 'passed'
            ? 'Test executed successfully'
            : 'Test execution failed',

        executionTime:
          duration / 1000,

        notes:
          status === 'passed'
            ? 'Executed by Playwright Automation'
            : errors,
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(
      `✅ AgentQ Updated | TC-${testCaseId} | ${status}`,
    );
  } catch (error: any) {
    console.error(
      '❌ AgentQ Sync Failed',
      error?.response?.data ||
        error?.message ||
        error,
    );
  }
}