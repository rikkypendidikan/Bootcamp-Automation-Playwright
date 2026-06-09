import { test } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { createUser } from '../utils/faker-data';
import { registerNegativeData } from '../data/register.data';

test.describe('Register Module', () => {
  test.setTimeout(60000);

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test.describe('Positive Cases', () => {
    test(
      'TC_Register_001 - Positive - Valid Register @Positive @Smoke',
      async () => {
        const user = createUser();

        await registerPage.register(user);
        await registerPage.verifySuccessfulRegistration();
      }
    );
  });

  test.describe('Negative Cases', () => {
    test(
      'TC_Register_002 - Negative - Invalid Email Format @Negative @Regression',
      async () => {
        const data =
          registerNegativeData.invalidEmail;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyInvalidEmail();
      }
    );

    test(
      'TC_Register_003 - Negative - Password Less Than 8 Characters @Negative @Regression',
      async () => {
        const data =
          registerNegativeData.invalidPassword;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyInvalidPassword();
      }
    );

    test(
      'TC_Register_004 - Negative - Password Confirmation Mismatch @Negative @Regression',
      async () => {
        const data =
          registerNegativeData.passwordMismatch;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyPasswordMismatch();
      }
    );

    test(
      'TC_Register_005 - Negative - Multiple Validation Errors @Negative @Regression',
      async () => {
        const data =
          registerNegativeData.multipleValidation;

        await registerPage.fillAccountInformation(
          data.email,
          data.password,
          data.confirmPassword
        );

        await registerPage.verifyMultipleValidationErrors();
      }
    );

    test(
      'TC_Register_006 - Negative - Full Name Less Than 2 Characters @Negative @Regression',
      async () => {
        const user = createUser();

        await registerPage.fillAccountInformation(
          user.email,
          user.password,
          user.confirmPassword
        );

        await registerPage.goToUserInformation();

        await registerPage.fillUserInformation(
          registerNegativeData.invalidFullName
            .fullName,
          registerNegativeData.invalidFullName
            .phoneNumber
        );

        await registerPage.verifyInvalidFullName();
      }
    );

    test(
      'TC_Register_007 - Negative - Invalid Phone Number @Negative @Regression',
      async () => {
        const user = createUser();

        await registerPage.fillAccountInformation(
          user.email,
          user.password,
          user.confirmPassword
        );

        await registerPage.goToUserInformation();

        await registerPage.fillUserInformation(
          registerNegativeData.invalidPhoneNumber
            .fullName,
          registerNegativeData.invalidPhoneNumber
            .phoneNumber
        );

        await registerPage.verifyInvalidPhoneNumber();
      }
    );
  });
});