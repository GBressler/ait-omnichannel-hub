// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Point to your Playwright tests directory
  testDir: './tests/',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* GLOBAL SETUP: 
     This runs our Token Injection script BEFORE any tests start.
  */
  globalSetup: require.resolve('./support/playwright/setupState.js'),

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://automationintesting.online',

    /* STORAGE STATE:
       Every test will automatically load this file to bypass Login.
    */
    storageState: path.resolve(__dirname, './playwright/.auth/storageState.json'),

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari']} 
    },
  ],
});