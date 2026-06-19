import { test as base, expect } from '@playwright/test';
import { pushTestResultToAgentQ } from '../helper/agentq-helper';

export { expect };

/**
 * ============================================================
 * PLAYWRIGHT FIXTURE
 * ============================================================
 *
 * Fixture ini digunakan sebagai global hook setelah setiap test.
 *
 * Tugas:
 * 1. Menampilkan ringkasan hasil eksekusi test.
 * 2. Mengumpulkan pesan error (jika ada).
 * 3. Mengirim hasil eksekusi ke AgentQ.
 *
 * ============================================================
 */

export const test = base.extend({});

/**
 * ============================================================
 * AFTER EACH TEST
 * ============================================================
 *
 * Hook ini akan selalu dipanggil setelah setiap test selesai,
 * baik test berhasil maupun gagal.
 *
 * ============================================================
 */
test.afterEach(async ({}, testInfo) => {
  /**
   * Konversi durasi ke detik agar lebih mudah dibaca.
   */
  const duration = Number(
    (testInfo.duration / 1000).toFixed(2),
  );

  /**
   * Gabungkan seluruh pesan error menjadi satu string.
   *
   * Jika tidak ada error maka gunakan "-".
   */
  const errors =
    testInfo.errors
      .map(error => error.message?.trim())
      .filter(Boolean)
      .join('\n\n') || '-';

  /**
   * ============================================================
   * LOG HASIL TEST
   * ============================================================
   */

  console.log('');
  console.log(
    '════════════════════════════════════════════════════════════',
  );
  console.log(
    '🧪 PLAYWRIGHT TEST COMPLETED',
  );
  console.log(
    '════════════════════════════════════════════════════════════',
  );

  console.log(
    `📄 Test Case     : ${testInfo.title}`,
  );

  console.log(
    `📊 Status        : ${String(testInfo.status).toUpperCase()}`,
  );

  console.log(
    `⏱ Duration      : ${duration} second(s)`,
  );

  console.log(
    `📂 File          : ${testInfo.file}`,
  );

  console.log(
    `📍 Retry         : ${testInfo.retry}`,
  );

  /**
   * Hanya tampilkan error apabila memang ada.
   */
  if (testInfo.status !== 'passed') {
    console.log('');
    console.log('❌ Error Summary');

    console.log(
      '────────────────────────────────────────────────────────────',
    );

    console.log(errors);

    console.log(
      '────────────────────────────────────────────────────────────',
    );
  }

  console.log(
    '════════════════════════════════════════════════════════════',
  );
  console.log('');

  /**
   * ============================================================
   * KIRIM HASIL KE AGENTQ
   * ============================================================
   *
   * Semua proses sinkronisasi dilakukan oleh helper.
   */
  await pushTestResultToAgentQ(
    testInfo.title,
    testInfo.status,
    testInfo.duration,
    errors,
  );
});