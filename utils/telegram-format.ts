export function formatTelegramReport(data: {
  title?: string;
  passed: number;
  failed: number;
  skipped?: number;
  environment: string;
  trigger: string;
  branch: string;
  workflowUrl: string;
}) {
  const status = data.failed === 0 ? '✅ PASSED' : '❌ FAILED';

  return `
🚀 ${data.title ?? 'EMRA AUTOMATION'}

━━━━━━━━━━━━━━━━━━

${status}

📊 TEST SUMMARY

✅ Passed : ${data.passed}
❌ Failed : ${data.failed}
⚪ Skipped : ${data.skipped ?? 0}

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