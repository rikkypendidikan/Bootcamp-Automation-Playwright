import { expect, Locator, Page } from '@playwright/test';

/**
 * =========================
 * LOGIN PAGE OBJECT MODEL
 * =========================
 * Semua action login disimpan di sini
 * agar test tidak duplicate logic UI
 */

export class LoginPage {
  readonly page: Page;

  // Locator input login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Input email user
    this.emailInput = page.getByRole('textbox', { name: 'Email' });

    // Input password user
    this.passwordInput = page.getByRole('textbox', { name: 'Passwords' });

    // Tombol login utama
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  /**
   * Navigasi ke halaman login
   * baseURL sudah diatur di playwright.config.ts
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Melakukan login ke aplikasi
   * @param email email user
   * @param password password user
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Validasi login gagal
   * Sistem harus tetap di halaman login
   */
  async verifyLoginFailed() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.signInButton).toBeVisible();
  }
}