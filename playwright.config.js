const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

// Use absolute pathing for the state file
const STORAGE_STATE = path.join(__dirname, 'auth-state/storageState.json');

module.exports = defineConfig({
  // 1. Point to the setup file
  //globalSetup: require.resolve('/playwright-web/global-setup'),
  globalSetup: path.join(__dirname, 'playwright-web', 'global-setup.js'),
  use: {
    // 2. Point to the JSON file that will be created
    // This path is relative to the ROOT of your project
    storageState: 'playwright-web/auth-state/storageState.json',
    baseURL: 'https://automationintesting.online',
  },
});