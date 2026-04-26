# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/admin-access.spec.js >> Verify Session Injection and Admin Access
- Location: tests/admin-access.spec.js:3:1

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Verify Session Injection and Admin Access', async ({ page, context }) => {
  4  |   // 1. Go to the home page first to ensure context is set
  5  |   await page.goto('/'); 
  6  |   
  7  |   // 2. DEBUG: Check if the token actually exists in the browser
  8  |   const cookies = await context.cookies();
  9  |   const tokenPresent = cookies.find(c => c.name === 'token');
  10 |   console.log(tokenPresent ? "✅ Token cookie found in browser context" : "❌ Token cookie MISSING in browser");
  11 | 
  12 |   //Thread sleep
  13 | await page.pause();
  14 | 
  15 |   // 3. Navigate to Admin
> 16 |   await page.goto('/#/admin');
     |              ^ Error: page.goto: Target page, context or browser has been closed
  17 |   
  18 |   // 4. Check for a specific element that only exists when logged in
  19 |   // On this site, it's often the "Create" button or the "Logout" link.
  20 |   const logoutLink = page.getByRole('link', { name: 'Logout' }); // Try 'link' instead of 'button'
  21 |   
  22 |   try {
  23 |     await expect(logoutLink).toBeVisible({ timeout: 5000 });
  24 |     console.log("🚀 Success: Bypassed login!");
  25 |   } catch (e) {
  26 |     console.log("⚠️ Redirected or Token Rejected. Current URL:", page.url());
  27 |     // Take a screenshot to see what happened (Senior Flex)
  28 |     await page.screenshot({ path: 'auth-failure.png' });
  29 |     throw e;
  30 |   }
  31 | });
```