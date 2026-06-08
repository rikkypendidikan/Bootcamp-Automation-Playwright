import { test } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { createUser } from '../utils/faker-data';
import { registerNegativeData } from '../data/register.data';

test.describe('Register Module', () => {
  test.describe('Positive Cases', () => {
    test(
      'TC_Register_001 - Positive - Valid Register @Positive @Smoke',
      async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.open();

        const user = createUser();

        await registerPage.register(user);

        await registerPage.verifySuccessfulRegistration();
      }
    );
  });

  test.describe('Negative Cases', () => {
    test(
      'TC_Register_002 - Negative - Invalid Email Format @Negative @Regression',
      async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.open();

        await registerPage.fillAccountInformation(
          registerNegativeData.invalidEmail.email,
          registerNegativeData.invalidEmail.password,
          registerNegativeData.invalidEmail.confirmPassword
        );

        await registerPage.verifyInvalidEmail();
      }
    );

    test(
      'TC_Register_003 - Negative - Password Less Than 8 Characters @Negative @Regression',
      async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.open();

        await registerPage.fillAccountInformation(
          registerNegativeData.invalidPassword.email,
          registerNegativeData.invalidPassword.password,
          registerNegativeData.invalidPassword.confirmPassword
        );

        await registerPage.verifyInvalidPassword();
      }
    );

    test(
      'TC_Register_004 - Negative - Password Confirmation Mismatch @Negative @Regression',
      async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.open();

        await registerPage.fillAccountInformation(
          registerNegativeData.passwordMismatch.email,
          registerNegativeData.passwordMismatch.password,
          registerNegativeData.passwordMismatch.confirmPassword
        );

        await registerPage.verifyPasswordMismatch();
      }
    );

    test(
      'TC_Register_005 - Negative - Multiple Validation Errors @Negative @Regression',
      async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.open();

        await registerPage.fillAccountInformation(
          registerNegativeData.multipleValidation.email,
          registerNegativeData.multipleValidation.password,
          registerNegativeData.multipleValidation.confirmPassword
        );

        await registerPage.verifyMultipleValidationErrors();
      }
    );
  });
});