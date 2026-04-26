const { test, expect } = require('@playwright/test');

test('verify session injection grants admin access', async ({ page, context }) => {
  await page.goto('/');

  const cookies = await context.cookies();
  expect(cookies.some(c => c.name === 'token'), 'Token cookie must be present').toBeTruthy();

  await page.goto('/#/admin');

  await expect(
    page.getByText('Logout', { exact: true })
  ).toBeVisible({ timeout: 10000 });
});