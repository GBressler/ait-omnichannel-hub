const axios = require('axios');

class ApiClient {
  constructor(baseURL = 'https://automationintesting.online') { // Removed /api from base to handle different paths
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      withCredentials: true // Crucial for handling session cookies
    });
  }

  // NEW: The "Handshake" method
  async login(username, password) {
    try {
      const response = await this.client.post('/api/auth/login', {
        username: username,
        password: password
      });
      
      // Look for the token in the 'set-cookie' header or the response body
      // This site usually uses a 'token' cookie.
      const token = response.headers['set-cookie']; 
      console.log(`[API Auth]: Successfully authenticated user: ${username}`);
      return token;
    } catch (error) {
      console.error(`[API Auth Error]: Failed to authenticate.`);
      throw error;
    }
  }

  async request(config) {
    try {
      console.log(`[API Request]: ${config.method?.toUpperCase()} ${this.client.defaults.baseURL}${config.url}`);
      return await this.client(config);
    } catch (error) {
      console.error(`[API Error]: ${error.response?.status} - ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ApiClient();