const fs = require('fs');

/**
 * Lokasi report JSON Playwright
 */
const REPORT_FILE = 'playwright-report/report.json';

let passed = 0;
let failed = 0;
let skipped = 0;
let duration = 0;

const errorDetails = [];

/**
 * Membersihkan pesan error
 */
function cleanText(text) {
  if (!text) {
    return 'Unknown Error';
  }

  return text
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500);
}

/**
 * Recursive parser
 */
function parseSuite(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const result = test.results?.at(-1);

      if (!result) {
        continue;
      }

      duration += result.duration || 0;

      switch (result.status) {
        case 'passed':
          passed++;
          break;

        case 'failed': {
          failed++;

          const title =
            spec.title ||
            test.title ||
            'Unknown Test';

          let errorMessage = 'Unknown Error';

          if (result.error?.message) {
            errorMessage = cleanText(
              result.error.message,
            );
          } else if (
            result.errors &&
            result.errors.length > 0
          ) {
            errorMessage = cleanText(
              result.errors[0].message,
            );
          }

          errorDetails.push(
            `${errorDetails.length + 1}. ${title}\n↳ ${errorMessage}`,
          );

          break;
        }

        default:
          skipped++;
      }
    }
  }

  for (const child of suite.suites || []) {
    parseSuite(child);
  }
}

/**
 * Membaca report Playwright
 */
if (fs.existsSync(REPORT_FILE)) {
  const report = JSON.parse(
    fs.readFileSync(REPORT_FILE, 'utf8'),
  );

  for (const suite of report.suites || []) {
    parseSuite(suite);
  }
}

/**
 * Jika tidak ada error
 */
if (errorDetails.length === 0) {
  errorDetails.push('Tidak ada error');
}

const errorsForTelegram = errorDetails
  .slice(0, 5)
  .join('\n\n');

/**
 * Export ke GitHub ENV
 */
fs.appendFileSync(
  process.env.GITHUB_ENV,
  `PASSED=${passed}
FAILED=${failed}
SKIPPED=${skipped}
DURATION=${Math.round(duration / 1000)}
ERRORS<<EOF
${errorsForTelegram}
EOF
`,
);