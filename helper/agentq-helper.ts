import { exportTestResult } from 'agentq-playwright/dist/testResult';

/**
 * =========================================================
 * MAPPING PLAYWRIGHT TEST CASE -> AGENTQ TC ID
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
 * KIRIM HASIL TEST KE AGENTQ (LOCAL + CI/CD)
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
   * AGENTQ NONAKTIF (GLOBAL SWITCH)
   * =========================================================
   */
  if (process.env.AGENTQ_ENABLE !== 'true') {
    return;
  }

  /**
   * =========================================================
   * VALIDASI TEST RUN ID
   * =========================================================
   */
  if (!process.env.AGENTQ_TESTRUN_ID) {
    console.warn('[AgentQ] AGENTQ_TESTRUN_ID belum dikonfigurasi');
    return;
  }

  try {

    /**
     * =========================================================
     * AMBIL TEST CASE CODE DARI TITLE
     * =========================================================
     * Contoh:
     * TC_LOGIN_001 - Positive - Login Success
     * -> TC_LOGIN_001
     */
    const testCaseCode = testTitle.split(' - ')[0];

    const tcId = AGENTQ_TC_MAPPING[testCaseCode];

    /**
     * =========================================================
     * AUTO-FALLBACK JIKA MAPPING TIDAK DITEMUKAN
     * =========================================================
     * Tidak lagi skip → tetap kirim ke AgentQ
     */
    const finalTcId = tcId ?? '0';

    if (!tcId) {
      console.warn(
        `[AgentQ] Mapping tidak ditemukan untuk: ${testCaseCode}. Menggunakan fallback TC_ID=0`,
      );
    }

    /**
     * =========================================================
     * MAPPING STATUS PLAYWRIGHT -> AGENTQ
     * =========================================================
     */
    const agentQStatus =
      status === 'passed'
        ? 'passed'
        : status === 'skipped'
          ? 'skipped'
          : 'failed';

    await exportTestResult(
      finalTcId,
      process.env.AGENTQ_TESTRUN_ID,
      {
        status: agentQStatus,
        actualResult: status ?? 'failed',
        executionTime,
        notes: notes
          ? `${notes}\n[TC_CODE: ${testCaseCode}]`
          : `[TC_CODE: ${testCaseCode}]`,
      },
    );

    console.log(
      `[AgentQ] Result terkirim: ${testCaseCode} -> TC_ID ${finalTcId}`,
    );

  } catch (error) {
    console.error(
      '[AgentQ] Gagal mengirim hasil test:',
      error,
    );
  }
}