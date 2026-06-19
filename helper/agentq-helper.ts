import { exportTestResult } from 'agentq-playwright/dist/testResult';

/**
 * =========================================================
 * MAPPING PLAYWRIGHT TEST CASE -> AGENTQ TC ID
 * =========================================================
 *
 * Mapping ini digunakan agar hasil test Playwright
 * dapat dikirim ke Test Case yang sesuai di AgentQ.
 *
 * Format:
 *
 * TC_LOGIN_001 -> 1
 * TC_LOGIN_002 -> 2
 * dst...
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
 * KIRIM HASIL TEST KE AGENTQ
 * =========================================================
 */
export async function pushTestResultToAgentQ(
  testTitle: string,
  status: string | undefined,
  executionTime: number,
  notes = '',
): Promise<void> {

  /**
   * =========================================================
   * AGENTQ NONAKTIF
   * =========================================================
   */
  if (process.env.AGENTQ_ENABLE !== 'true') {
    return;
  }

  /**
   * =========================================================
   * SKIP DI GITHUB ACTIONS
   * =========================================================
   *
   * Saat ini endpoint AgentQ terkadang diblokir
   * Cloudflare ketika dipanggil dari GitHub Runner.
   *
   * Agar workflow CI/CD tetap stabil maka
   * sinkronisasi AgentQ hanya dijalankan di local.
   */
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.log(
      '[AgentQ] Sinkronisasi dilewati pada GitHub Actions',
    );
    return;
  }

  /**
   * =========================================================
   * VALIDASI TEST RUN ID
   * =========================================================
   */
  if (!process.env.AGENTQ_TESTRUN_ID) {
    console.warn(
      '[AgentQ] AGENTQ_TESTRUN_ID belum dikonfigurasi',
    );
    return;
  }

  try {

    /**
     * =========================================================
     * AMBIL KODE TEST CASE
     * =========================================================
     *
     * Contoh:
     *
     * TC_LOGIN_001 - Positive - Login Success
     *
     * Menjadi:
     *
     * TC_LOGIN_001
     */
    const testCaseCode = testTitle.split(' - ')[0];

    const tcId = AGENTQ_TC_MAPPING[testCaseCode];

    /**
     * Mapping tidak ditemukan
     */
    if (!tcId) {
      console.warn(
        `[AgentQ] Mapping tidak ditemukan untuk: ${testCaseCode}`,
      );
      return;
    }

    /**
     * =========================================================
     * MAPPING STATUS PLAYWRIGHT -> AGENTQ
     * =========================================================
     *
     * Playwright:
     * - passed
     * - failed
     * - skipped
     * - timedOut
     * - interrupted
     *
     * AgentQ:
     * - passed
     * - failed
     * - skipped
     */
    const agentQStatus =
      status === 'passed'
        ? 'passed'
        : status === 'skipped'
          ? 'skipped'
          : 'failed';

    await exportTestResult(
      tcId,
      process.env.AGENTQ_TESTRUN_ID,
      {
        status: agentQStatus,

        actualResult:
          status ??
          'failed',

        executionTime,

        notes,
      },
    );

    console.log(
      `[AgentQ] Result berhasil dikirim untuk ${testCaseCode}`,
    );

  } catch (error) {

    /**
     * Jangan sampai AgentQ membuat
     * test automation menjadi gagal.
     */
    console.error(
      '[AgentQ] Gagal mengirim hasil test:',
      error,
    );

  }
}