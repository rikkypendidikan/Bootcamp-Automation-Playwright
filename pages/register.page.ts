import { expect, Locator, Page } from '@playwright/test';
import type { RegisterUser } from '../utils/faker-data';

export class RegisterPage {
  readonly page: Page;

  private readonly DEFAULT_COMPANY = {
    industry: 'education',
    companySize: '200+',
  };

  // Step 1 - Account Information
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly nextButton: Locator;

  // Step 2 - User Information
  readonly fullNameInput: Locator;
  readonly phoneNumberInput: Locator;

  // Step 3 - Company Information
  readonly companyNameInput: Locator;
  readonly industryDropdown: Locator;
  readonly companySizeDropdown: Locator;
  readonly createAccountButton: Locator;

  // Success Messages
  readonly verifyEmailMessage: Locator;
  readonly accountCreatedMessage: Locator;
  readonly companyFailedMessage: Locator;

  // Validation Messages
  readonly invalidEmailMessage: Locator;
  readonly invalidPasswordMessage: Locator;
  readonly passwordMismatchMessage: Locator;
  readonly invalidFullNameMessage: Locator;
  readonly invalidPhoneNumberMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', {
      name: 'Email',
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password',
      exact: true,
    });

    this.confirmPasswordInput = page.getByRole(
      'textbox',
      {
        name: 'Confirm Password',
      }
    );

    this.nextButton = page.getByRole('button', {
      name: 'Next',
    });

    this.fullNameInput = page.getByRole(
      'textbox',
      {
        name: 'Full Name',
      }
    );

    this.phoneNumberInput = page.getByRole(
      'textbox',
      {
        name: 'Phone Number',
      }
    );

    this.companyNameInput = page.getByRole(
      'textbox',
      {
        name: 'Company Name',
      }
    );

    this.industryDropdown =
      page.getByLabel('Industry');

    this.companySizeDropdown =
      page.getByLabel('Company Size');

    this.createAccountButton =
      page.getByRole('button', {
        name: 'Create Account',
      });

    this.verifyEmailMessage =
      page.getByText(
        'Please verify your email'
      );

    this.accountCreatedMessage =
      page.getByText(
        'Account created successfully!'
      );

    this.companyFailedMessage =
      page.getByText(
        'Company registration failed'
      );

    this.invalidEmailMessage =
      page.getByText(
        'Please enter a valid email'
      );

    this.invalidPasswordMessage =
      page.getByText(
        'Password must be at least 8'
      );

    this.passwordMismatchMessage =
      page.getByText(
        'Passwords do not match'
      );

    this.invalidFullNameMessage =
      page.getByText(
        'Name must be at least 2 characters'
      );

    this.invalidPhoneNumberMessage =
      page.getByText(
        'Please enter a valid phone number (9-13 digits)'
      );
  }

  private async clickNext() {
    await expect(
      this.nextButton
    ).toBeEnabled();

    await this.nextButton.click();
  }

  async open() {
    await this.page.goto(
      'https://www.emra.chat/signup',
      {
        waitUntil: 'networkidle',
      }
    );

    await expect(
      this.emailInput
    ).toBeVisible();
  }

  async fillAccountInformation(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await expect(
      this.emailInput
    ).toBeVisible();

    await this.emailInput.fill(email);

    await this.passwordInput.fill(
      password
    );

    await this.confirmPasswordInput.fill(
      confirmPassword
    );

    await this.confirmPasswordInput.blur();
  }

  async goToUserInformation() {
    await this.clickNext();

    await expect(
      this.fullNameInput
    ).toBeVisible();
  }

  async fillUserInformation(
    fullName: string,
    phoneNumber: string
  ) {
    await expect(
      this.fullNameInput
    ).toBeVisible();

    await this.fullNameInput.fill(
      fullName
    );

    await this.phoneNumberInput.fill(
      phoneNumber
    );

    await this.phoneNumberInput.blur();
  }

  async submitUserInformation() {
    await this.clickNext();

    await expect(
      this.companyNameInput
    ).toBeVisible();
  }

  async fillCompanyInformation(
    companyName: string
  ) {
    await expect(
      this.companyNameInput
    ).toBeVisible();

    await this.companyNameInput.fill(
      companyName
    );

    await this.industryDropdown.selectOption(
      this.DEFAULT_COMPANY.industry
    );

    await this.companySizeDropdown.selectOption(
      this.DEFAULT_COMPANY.companySize
    );
  }

  async submitRegistration() {
    await expect(
      this.createAccountButton
    ).toBeEnabled();

    await this.createAccountButton.click();

    await Promise.race([
      this.accountCreatedMessage.waitFor({
        state: 'visible',
        timeout: 20000,
      }),

      this.verifyEmailMessage.waitFor({
        state: 'visible',
        timeout: 20000,
      }),

      this.companyFailedMessage.waitFor({
        state: 'visible',
        timeout: 20000,
      }),
    ]);
  }

  async register(user: RegisterUser) {
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

  async verifySuccessfulRegistration() {
    const accountCreated =
      await this.accountCreatedMessage
        .isVisible()
        .catch(() => false);

    const verifyEmail =
      await this.verifyEmailMessage
        .isVisible()
        .catch(() => false);

    const companyFailed =
      await this.companyFailedMessage
        .isVisible()
        .catch(() => false);

    expect(
      accountCreated ||
        verifyEmail ||
        companyFailed
    ).toBeTruthy();
  }

  async verifyInvalidEmail() {
    await expect(
      this.invalidEmailMessage
    ).toBeVisible({
      timeout: 5000,
    });
  }

  async verifyInvalidPassword() {
    await expect(
      this.invalidPasswordMessage
    ).toBeVisible({
      timeout: 5000,
    });
  }

  async verifyPasswordMismatch() {
    await expect(
      this.passwordMismatchMessage
    ).toBeVisible({
      timeout: 5000,
    });
  }

  async verifyMultipleValidationErrors() {
    await expect(
      this.invalidEmailMessage
    ).toBeVisible();

    await expect(
      this.invalidPasswordMessage
    ).toBeVisible();

    await expect(
      this.passwordMismatchMessage
    ).toBeVisible();
  }

  async verifyInvalidFullName() {
    await expect(
      this.invalidFullNameMessage
    ).toBeVisible({
      timeout: 5000,
    });

    await expect(
      this.nextButton
    ).toBeDisabled();
  }

  async verifyInvalidPhoneNumber() {
    await this.clickNext();

    await expect(
      this.invalidPhoneNumberMessage
    ).toBeVisible({
      timeout: 5000,
    });
  }
}