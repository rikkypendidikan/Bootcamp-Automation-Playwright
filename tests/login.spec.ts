import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('TC_LOGIN_001 - Positive - Valid Login @Positive @Smoke', async ({ page }) => {
  await page.goto('https://www.emra.chat/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' })
  .fill(process.env.EMAIL!, { force: true });
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' })
  .fill(process.env.PASSWORD!, { force: true });
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Tunggu halaman selesai loading
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })).toBeVisible();
  // Tunggu heading muncul sampai 30 detik
await expect(
  page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })
).toBeVisible({ timeout: 30000 });
});