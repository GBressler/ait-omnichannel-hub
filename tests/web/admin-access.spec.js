const { test, expect } = require('@playwright/test');

test('Verify Session Injection and Admin Access', async ({ page, context }) => {
  // 1. Go to the home page first to ensure context is set
  await page.goto('/'); 
  
  // 2. DEBUG: Check if the token actually exists in the browser
  const cookies = await context.cookies();
  const tokenPresent = cookies.find(c => c.name === 'token');
  console.log(tokenPresent ? "Token cookie found in browser context" : "Token cookie MISSING in browser");

  //Thread sleep
await page.pause();

  // 3. Navigate to Admin
  await page.goto('/#/admin');
  
  // 4. Check for a specific element that only exists when logged in
  // On this site, it's often the "Create" button or the "Logout" link.
  const logoutLink = page.getByRole('link', { name: 'Logout' }); // Try 'link' instead of 'button'
  
  try {
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
    console.log("Success: Bypassed login!");
  } catch (e) {
    console.log("Redirected or Token Rejected. Current URL:", page.url());
    // Take a screenshot to see what happened 
    await page.screenshot({ path: 'auth-failure.png' });
    throw e;
  }
});