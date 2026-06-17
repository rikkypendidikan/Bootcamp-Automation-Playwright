import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object Login
 * Semua aksi terkait login disimpan di sini
 */
export class LoginPage {
  readonly page: Page;

  // Locator form login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  /**
   * Buka halaman login (menggunakan baseURL dari config)
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Melakukan proses login
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Validasi login gagal (tetap di halaman login)
   */
  async verifyLoginFailed() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.signInButton).toBeVisible();
  }
}