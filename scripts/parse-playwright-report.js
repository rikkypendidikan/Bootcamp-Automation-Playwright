const fs = require('fs');

/**
 * File report JSON dari Playwright
 */
const REPORT_FILE = 'playwright-report/report.json';

let passed = 0;
let failed = 0;
let skipped = 0;
let duration = 0;
let errors = [];

/**
 * Recursive parser
 * Karena struktur report Playwright bersifat nested
 */
function parseSuite(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      /**
       * Ambil result terakhir
       */
      const result = test.results?.at(-1);

      if (!result) continue;

      duration += result.duration || 0;

      switch (result.status) {
        case 'passed':
          passed++;
          break;

        case 'failed':
          failed++;

          errors.push(
            `${test.title}`
          );
          break;

        default:
          skipped++;
      }
    }
  }

  /**
   * Recursive child suites
   */
  for (const childSuite of suite.suites || []) {
    parseSuite(childSuite);
  }
}

/**
 * Jika report tersedia
 */
if (fs.existsSync(REPORT_FILE)) {
  const report = JSON.parse(
    fs.readFileSync(REPORT_FILE, 'utf8')
  );

  for (const suite of report.suites || []) {
    parseSuite(suite);
  }
}

/**
 * Jika tidak ada error
 */
if (errors.length === 0) {
  errors.push('Tidak ada error');
}

/**
 * Export ke GitHub Environment Variable
 */
fs.appendFileSync(
  process.env.GITHUB_ENV,
  `
PASSED=${passed}
FAILED=${failed}
SKIPPED=${skipped}
DURATION=${Math.round(duration / 1000)}
ERRORS=${errors.slice(0, 5).join(' | ')}
`,
);