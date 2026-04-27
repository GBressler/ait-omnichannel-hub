require('dotenv').config();
const axios = require('axios');
const config = require('../config');

class ApiClient {
  constructor() {
    this.baseURL = config.baseUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true  // Allow cookies to be sent/received
    });
  }

  async request(config) {
    try {
      const response = await this.client({
        ...config,
        withCredentials: true
      });
      
      return response;
    } catch (error) {
      this.logFailure(config, error);
      throw error; 
    }
  }

  logFailure(config, error) {
    const status = error.response?.status || 'NETWORK_ERROR';
    const method = config.method?.toUpperCase() || 'GET';
    const url = config.url;

    console.error('\n' + '='.repeat(50));
    console.error(`🔴 API FAILURE: [${method}] ${this.baseURL}${url}`);
    console.error(`   Status Code: ${status}`);
    
    if (config.data) {
      console.error(`   Payload Sent:`, JSON.stringify(config.data, null, 2));
    }

    if (error.response?.data) {
      console.error(`   Server Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`   Error Message: ${error.message}`);
    }
    console.error('='.repeat(50) + '\n');
  }
}

module.exports = new ApiClient();