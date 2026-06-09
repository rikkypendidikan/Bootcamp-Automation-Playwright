import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  /**
   * Login Form
   */
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', {
      name: 'Email',
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password',
    });

    this.signInButton = page.getByRole('button', {
      name: 'Sign In',
    });
  }

  async goto() {
    await this.page.goto(
      'https://www.emra.chat/login'
    );
  }

  /**
   * Login using provided credentials
   */
  async login(
    email: string,
    password: string
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async verifyLoginFailed() {
    await expect(this.page).toHaveURL(/login/);

    await expect(
      this.signInButton
    ).toBeVisible();
  }
}