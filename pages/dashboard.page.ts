import { expect, Locator, Page } from '@playwright/test';

/**
 * =========================
 * DASHBOARD PAGE OBJECT
 * =========================
 * Validasi halaman setelah login sukses
 */

export class DashboardPage {
  readonly welcomeHeading: Locator;

  constructor(page: Page) {

    // Heading utama dashboard sebagai indikator login berhasil
    this.welcomeHeading = page.getByRole('heading', {
      name: 'Welcome to Emra! 🎉',
    });
  }

  /**
   * Validasi dashboard berhasil terbuka
   */
  async verifyDashboardLoaded() {
    await expect(this.welcomeHeading).toBeVisible({
      timeout: 30000,
    });
  }
}