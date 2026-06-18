/**
 * =========================================================
 * PLAYWRIGHT REPORT PARSER
 * =========================================================
 *
 * Fungsi:
 * - Membaca file report.json hasil Playwright
 * - Menghitung jumlah Passed, Failed, Skipped
 * - Menghitung total durasi test
 * - Mengambil ringkasan error yang gagal
 * - Mengirim hasil parsing ke GitHub Environment Variable
 *
 * Output:
 * PASSED
 * FAILED
 * SKIPPED
 * DURATION
 * ERRORS
 *
 * Variable tersebut akan digunakan oleh step
 * Telegram Notification pada GitHub Actions.
 */

const fs = require('fs');

/**
 * Lokasi file report JSON yang dihasilkan reporter Playwright
 */
const REPORT_FILE = 'playwright-report/report.json';

/**
 * Counter hasil test
 */
let passed = 0;
let failed = 0;
let skipped = 0;
let duration = 0;

/**
 * Menyimpan daftar error test yang gagal
 */
const errorDetails = [];

/**
 * Membersihkan pesan error agar lebih rapi untuk Telegram.
 *
 * Yang dibersihkan:
 * - ANSI color code terminal
 * - Spasi berlebih
 * - Panjang pesan dibatasi 500 karakter
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
 * Parse seluruh suite Playwright secara rekursif.
 *
 * Struktur report Playwright:
 * Suite
 * ├── Suite
 * │   ├── Spec
 * │   │   ├── Test
 *
 * Karena suite dapat memiliki child suite,
 * maka fungsi ini dipanggil secara rekursif.
 */
function parseSuite(suite) {
  /**
   * Loop seluruh spec pada suite
   */
  for (const spec of suite.specs || []) {
    /**
     * Loop seluruh test pada spec
     */
    for (const test of spec.tests || []) {
      /**
       * Ambil result terakhir.
       *
       * Penting:
       * Jika retry aktif, Playwright akan
       * menyimpan beberapa result.
       *
       * Kita hanya mengambil result terakhir
       * sebagai status final test.
       */
      const result = test.results?.at(-1);

      if (!result) {
        continue;
      }

      /**
       * Akumulasi total durasi test
       */
      duration += result.duration || 0;

      /**
       * Hitung status test
       */
      switch (result.status) {
        case 'passed':
          passed++;
          break;

        case 'failed': {
          failed++;

          /**
           * Ambil judul test yang paling relevan
           */
          const title =
            spec.title ||
            test.title ||
            'Unknown Test';

          let errorMessage = 'Unknown Error';

          /**
           * Ambil pesan error utama
           */
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

          /**
           * Simpan ringkasan error
           * untuk dikirim ke Telegram
           */
          errorDetails.push(
            `${errorDetails.length + 1}. ${title}\n↳ ${errorMessage}`,
          );

          break;
        }

        /**
         * Semua status selain passed/failed
         * dianggap skipped.
         */
        default:
          skipped++;
      }
    }
  }

  /**
   * Parse child suite secara rekursif
   */
  for (const child of suite.suites || []) {
    parseSuite(child);
  }
}

/**
 * Jika report tersedia maka lakukan parsing
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
 * Jika tidak ada error,
 * tetap kirim placeholder agar Telegram tidak kosong.
 */
if (errorDetails.length === 0) {
  errorDetails.push('Tidak ada error');
}

/**
 * Batasi maksimal 5 error pertama
 * agar pesan Telegram tidak terlalu panjang.
 */
const errorsForTelegram = errorDetails
  .slice(0, 5)
  .join('\n\n');

/**
 * Simpan hasil parsing ke GitHub Environment Variable.
 *
 * Variable ini dapat digunakan oleh step berikutnya
 * dalam workflow GitHub Actions.
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