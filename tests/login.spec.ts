import { test } from '@playwright/test';
import dotenv from 'dotenv';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { users } from '../data/users';

dotenv.config();

test.describe('Login Module', () => {
  test('TC_LOGIN_001 - Positive - Valid Login @Login @Positive @Smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.valid.email,
      users.valid.password
    );

    // 🔥 IMPORTANT: tunggu transisi login selesai
    await page.waitForLoadState('networkidle');

    await dashboardPage.verifyDashboardLoaded();
  });

  test('TC_LOGIN_002 - Negative - Invalid Login @Login @Negative', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      users.invalid.email,
      users.invalid.password
    );

    // 🔥 stabilisasi UI setelah failed login
    await page.waitForLoadState('domcontentloaded');

    await loginPage.verifyLoginFailed();
  });
});