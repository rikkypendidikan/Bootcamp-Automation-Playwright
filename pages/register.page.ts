import { expect, Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // =====================
  // Step 1 - Account Information
  // =====================

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly nextButton: Locator;

  // =====================
  // Step 2 - User Information
  // =====================

  readonly fullNameInput: Locator;
  readonly phoneNumberInput: Locator;

  // =====================
  // Step 3 - Company Information
  // =====================

  readonly companyNameInput: Locator;
  readonly industryDropdown: Locator;
  readonly companySizeDropdown: Locator;
  readonly createAccountButton: Locator;

  // =====================
  // Success Messages
  // =====================

  readonly verifyEmailMessage: Locator;

  // =====================
  // Validation Messages
  // =====================

  readonly invalidEmailMessage: Locator;
  readonly invalidPasswordMessage: Locator;
  readonly passwordMismatchMessage: Locator;
  readonly invalidFullNameMessage: Locator;
  readonly invalidPhoneNumberMessage: Locator;

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

    this.invalidFullNameMessage = page.getByText(
      'Name must be at least 2 characters'
    );

    this.invalidPhoneNumberMessage = page.getByText(
      'Please enter a valid phone number (9-13 digits)'
    );
  }

  async open() {
    await this.page.goto('https://www.emra.chat/signup');
  }

  // =====================
  // Step 1 Actions
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

  async goToUserInformation() {
    await this.nextButton.click();
  }

  // =====================
  // Step 2 Actions
  // =====================

  async fillUserInformation(
    fullName: string,
    phoneNumber: string
  ) {
    await this.fullNameInput.fill(fullName);
    await this.phoneNumberInput.fill(phoneNumber);

    await this.phoneNumberInput.blur();
  }

  async submitUserInformation() {
    await this.nextButton.click();
  }

  // =====================
  // Step 3 Actions
  // =====================

  async fillCompanyInformation(
    companyName: string
  ) {
    await this.companyNameInput.fill(companyName);

    await this.industryDropdown.selectOption(
      'education'
    );

    await this.companySizeDropdown.selectOption(
      '200+'
    );
  }

  async submitRegistration() {
    await this.createAccountButton.click();
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
    await this.fillAccountInformation(
      user.email,
      user.password,
      user.confirmPassword
    );

    await this.goToUserInformation();

    await this.fillUserInformation(
      user.fullName,
      user.phoneNumber
    );

    await this.submitUserInformation();

    await this.fillCompanyInformation(
      user.companyName
    );

    await this.submitRegistration();
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

  async verifyInvalidFullName() {
    await expect(this.invalidFullNameMessage).toBeVisible();
    await expect(this.nextButton).toBeDisabled();
  }

  async verifyInvalidPhoneNumber() {
    await expect(this.nextButton).toBeEnabled();

    await this.nextButton.click();

    await expect(
      this.invalidPhoneNumberMessage
    ).toBeVisible();
  }
}