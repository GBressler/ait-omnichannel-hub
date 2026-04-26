const { test, expect } = require('@playwright/test');

test('verify session injection grants admin access', async ({ page }) => {
  await page.goto('/');
  await page.goto('/admin/rooms');

  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 15000 });
});