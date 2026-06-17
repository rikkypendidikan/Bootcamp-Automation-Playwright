import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { users } from '../data/users';

test.describe('Login Module', () => {
  test(
    'TC_LOGIN_001 - Positive - Successfully login using valid credential @Login @Positive @Smoke @Regression',
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await loginPage.goto();

      await loginPage.login(
        users.valid.email,
        users.valid.password
      );

      await page.waitForLoadState('networkidle');

      await dashboardPage.verifyDashboardLoaded();
    }
  );

  test(
    'TC_LOGIN_002 - Negative - Login failed using invalid credential @Login @Negative @Regression',
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login(
        users.invalid.email,
        users.invalid.password
      );

      await page.waitForLoadState('domcontentloaded');

      await loginPage.verifyLoginFailed();
    }
  );
});