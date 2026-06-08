import { expect, Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Step 1
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly nextButton: Locator;

  // Step 2
  readonly fullNameInput: Locator;
  readonly phoneNumberInput: Locator;

  // Step 3
  readonly companyNameInput: Locator;
  readonly industryDropdown: Locator;
  readonly companySizeDropdown: Locator;
  readonly createAccountButton: Locator;

  // Success Message
  readonly verifyEmailMessage: Locator;

  // Validation Messages
  readonly invalidEmailMessage: Locator;
  readonly invalidPasswordMessage: Locator;
  readonly passwordMismatchMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.emailInput = page.getByRole('textbox', {
      name: 'Email',
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password',
      exact: true,
    });

    this.confirmPasswordInput = page.getByRole('textbox', {
      name: 'Confirm Password',
    });

    this.nextButton = page.getByRole('button', {
      name: 'Next',
    });

    // Step 2
    this.fullNameInput = page.getByRole('textbox', {
      name: 'Full Name',
    });

    this.phoneNumberInput = page.getByRole('textbox', {
      name: 'Phone Number',
    });

    // Step 3
    this.companyNameInput = page.getByRole('textbox', {
      name: 'Company Name',
    });

    this.industryDropdown = page.getByLabel('Industry');

    this.companySizeDropdown = page.getByLabel('Company Size');

    this.createAccountButton = page.getByRole('button', {
      name: 'Create Account',
    });

    // Success
    this.verifyEmailMessage = page.getByText(
      'Please verify your email'
    );

    // Validation
    this.invalidEmailMessage = page.getByText(
      'Please enter a valid email'
    );

    this.invalidPasswordMessage = page.getByText(
      'Password must be at least 8'
    );

    this.passwordMismatchMessage = page.getByText(
      'Passwords do not match'
    );
  }

  async open() {
    await this.page.goto('https://www.emra.chat/signup');
  }

  // =====================
  // Positive Flow
  // =====================

  async register(user: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: string;
    companyName: string;
  }) {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);

    await this.nextButton.click();

    await this.fullNameInput.fill(user.fullName);
    await this.phoneNumberInput.fill(user.phoneNumber);

    await this.nextButton.click();

    await this.companyNameInput.fill(user.companyName);

    await this.industryDropdown.selectOption('education');
    await this.companySizeDropdown.selectOption('200+');

    await this.createAccountButton.click();
  }

  // =====================
  // Negative Flow
  // =====================

  async fillAccountInformation(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);

    await this.confirmPasswordInput.blur();
  }

  // =====================
  // Assertions
  // =====================

  async verifySuccessfulRegistration() {
    await expect(this.verifyEmailMessage).toBeVisible();
  }

  async verifyInvalidEmail() {
    await expect(this.invalidEmailMessage).toBeVisible();
  }

  async verifyInvalidPassword() {
    await expect(this.invalidPasswordMessage).toBeVisible();
  }

  async verifyPasswordMismatch() {
    await expect(this.passwordMismatchMessage).toBeVisible();
  }

  async verifyMultipleValidationErrors() {
    await expect(this.invalidEmailMessage).toBeVisible();
    await expect(this.invalidPasswordMessage).toBeVisible();
    await expect(this.passwordMismatchMessage).toBeVisible();
  }
}