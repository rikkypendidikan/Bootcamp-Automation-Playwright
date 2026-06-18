import { test } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { createUser } from '../utils/faker-data';
import { registerNegativeData } from '../data/register.data';

test.describe('Register Module', () => {

  test.setTimeout(60000);

  let registerPage: RegisterPage;

  /**
   * =========================
   * SETUP SEBELUM TEST
   * =========================
   * Membuka halaman register setiap test berjalan
   */
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test.describe('Positive Cases', () => {

    test(
      'TC_REGISTER_001 - Positive - Successfully register new account @Register @Positive @Smoke @Regression',
      async () => {

        const user = createUser();

        await registerPage.register(user);

        await registerPage.verifySuccessfulRegistration();
      }
    );
  });

  test.describe('Negative Cases', () => {

    test(
      'TC_REGISTER_002 - Negative - Invalid email format should show validation @Register @Negative @Regression',
      async () => {

        const data = registerNegativeData.invalidEmail;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyInvalidEmail();
      }
    );

    test(
      'TC_REGISTER_003 - Negative - Password less than 8 characters should fail @Register @Negative @Regression',
      async () => {

        const data = registerNegativeData.invalidPassword;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyInvalidPassword();
      }
    );

    test(
      'TC_REGISTER_004 - Negative - Password confirmation mismatch should fail @Register @Negative @Regression',
      async () => {

        const data = registerNegativeData.passwordMismatch;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyPasswordMismatch();
      }
    );

    test(
      'TC_REGISTER_005 - Negative - Multiple validation errors should be shown @Register @Negative @Regression',
      async () => {

        const data = registerNegativeData.multipleValidation;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyMultipleValidationErrors();
      }
    );

    test(
      'TC_REGISTER_006 - Negative - Full name too short should fail @Register @Negative @Regression',
      async () => {

        const user = createUser();

        await registerPage.fillAccountInformation(
          user.email,
          user.password,
          user.confirmPassword
        );

        await registerPage.goToUserInformation();

        await registerPage.fillUserInformation(
          registerNegativeData.invalidFullName.fullName,
          registerNegativeData.invalidFullName.phoneNumber
        );

        await registerPage.verifyInvalidFullName();
      }
    );

    test(
      'TC_REGISTER_007 - Negative - Invalid phone number should fail @Register @Negative @Regression',
      async () => {

        const user = createUser();

        await registerPage.fillAccountInformation(
          user.email,
          user.password,
          user.confirmPassword
        );

        await registerPage.goToUserInformation();

        await registerPage.fillUserInformation(
          registerNegativeData.invalidPhoneNumber.fullName,
          registerNegativeData.invalidPhoneNumber.phoneNumber
        );

        await registerPage.verifyInvalidPhoneNumber();
      }
    );
  });
});