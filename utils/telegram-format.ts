/**
 * =========================================================
 * TELEGRAM MESSAGE FORMATTER
 * =========================================================
 *
 * Fungsi:
 * Membentuk template pesan Telegram
 * agar format notifikasi selalu konsisten.
 */

export function formatTelegramReport(data: {
  title?: string;
  passed: number;
  failed: number;
  skipped?: number;
  duration?: number;
  environment: string;
  trigger: string;
  branch: string;
  workflowUrl: string;
  errors?: string;
}) {
  /**
   * Menentukan status akhir test
   */
  const status =
    data.failed === 0
      ? '✅ PASSED'
      : '❌ FAILED';

  /**
   * Template pesan Telegram
   */
  return `
🚀 ${data.title ?? 'EMRA AUTOMATION'}

━━━━━━━━━━━━━━━━━━

${status}

📊 TEST SUMMARY

✅ Passed : ${data.passed}
❌ Failed : ${data.failed}
⚪ Skipped : ${data.skipped ?? 0}
⏱ Duration : ${data.duration ?? 0}s

━━━━━━━━━━━━━━━━━━

❌ Errors

${data.errors ?? 'Tidak ada error'}

━━━━━━━━━━━━━━━━━━

📸 Screenshot : Available
🎥 Video : Available
🧭 Trace : Available

━━━━━━━━━━━━━━━━━━

🌍 Environment
${data.environment}

👤 Trigger
${data.trigger}

🌿 Branch
${data.branch}

━━━━━━━━━━━━━━━━━━

🔗 Workflow
${data.workflowUrl}

━━━━━━━━━━━━━━━━━━

🤖 Playwright + GitHub Actions
`.trim();
}