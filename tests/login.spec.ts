import { test } from '@playwright/test';
import dotenv from 'dotenv';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { users } from '../data/users';

dotenv.config();

test('TC_LOGIN_001 - Valid Login @Smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();

  await loginPage.login(
    users.valid.email,
    users.valid.password
  );

  await dashboardPage.verifyDashboardLoaded();
});