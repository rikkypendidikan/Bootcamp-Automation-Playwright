import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.welcomeHeading = page.getByRole('heading', {
      name: 'Welcome to Emra! 🎉',
    });
  }

  async verifyDashboardLoaded() {
    await expect(this.welcomeHeading).toBeVisible({
      timeout: 30000,
    });
  }
}