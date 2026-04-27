/**
 * config.js
 * Merged Configuration for local and CI (GitHub Actions) execution.
 */

module.exports = {
  // Primary URL with environment variable injection for CI
  baseUrl: process.env.TEST_BASE_URL || 'https://automationintesting.online/',
  apiUsername: process.env.API_USERNAME,
  apiPassword: process.env.API_PASSWORD,
  // API Endpoints
  roomApiUrl: 'room/',
  authApiUrl: 'auth/login',

  // Sauce Labs Credentials 
  // pulled from GitHub Secrets during the CI run
  sauce: {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    region: process.env.SAUCE_REGION || 'us-west-1'
  },

  // Default Test Data 
  testData: {
    roomDescription: 'API-automated room for testing purposes.',
    roomType: 'Double',
    accessible: true
  }
};