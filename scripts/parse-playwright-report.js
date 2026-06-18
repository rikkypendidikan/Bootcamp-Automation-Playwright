const fs = require('fs');

const file = 'playwright-report/report.json';

let passed = 0;
let failed = 0;
let skipped = 0;
let duration = 0;
let errors = [];

if (fs.existsSync(file)) {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

  for (const suite of data.suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const result = test.results?.[0];

        if (!result) continue;

        duration += result.duration || 0;

        if (result.status === 'passed') passed++;
        else if (result.status === 'failed') {
          failed++;
          errors.push(test.title);
        } else {
          skipped++;
        }
      }
    }
  }
}

fs.appendFileSync(process.env.GITHUB_ENV, `
PASSED=${passed}
FAILED=${failed}
SKIPPED=${skipped}
DURATION=${Math.round(duration / 1000)}
ERRORS=${errors.slice(0, 3).join(' | ')}
`);