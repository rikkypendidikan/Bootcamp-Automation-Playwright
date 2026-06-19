import { test } from '../fixtures/agentq.fixture';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { users } from '../utils/users';

test.describe('Login Module', () => {

  test(
    'TC_LOGIN_001 - Positive - Successfully login using valid credential @Login @Positive @Smoke @Regression',
    async ({ page }) => {

      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      // Buka halaman login
      await loginPage.goto();

      // Login menggunakan user valid dari ENV
      await loginPage.login(users.valid.email, users.valid.password);

      // Tunggu halaman stabil setelah login
      await page.waitForLoadState('networkidle');

      // Validasi dashboard berhasil tampil
      await dashboardPage.verifyDashboardLoaded();
    }
  );

  test(
    'TC_LOGIN_002 - Negative - Login failed using invalid credential @Login @Negative @Regression',
    async ({ page }) => {

      const loginPage = new LoginPage(page);

      // Buka halaman login
      await loginPage.goto();

      // Login dengan data invalid
      await loginPage.login(users.invalid.email, users.invalid.password);

      // Validasi tetap di halaman login
      await loginPage.verifyLoginFailed();
    }
  );
});