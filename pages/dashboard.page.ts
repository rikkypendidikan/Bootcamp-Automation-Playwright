import { expect, Locator, Page } from '@playwright/test';

/**
 * Dashboard Page Object Model
 * Digunakan setelah user berhasil login
 */
export class DashboardPage {
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    // Elemen utama untuk memastikan dashboard sudah terbuka
    this.welcomeHeading = page.getByRole('heading', {
      name: 'Welcome to Emra! 🎉',
    });
  }

  /**
   * Validasi bahwa user sudah masuk ke dashboard
   */
  async verifyDashboardLoaded() {
    await expect(this.welcomeHeading).toBeVisible({
      timeout: 30000,
    });
  }
}