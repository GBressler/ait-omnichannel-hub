const api = require('./ApiClient');

class AuthProvider {
  async login(username = 'admin', password = 'password') {
    const response = await api.request({
      method: 'post',
      url: '/api/auth/login',
      data: { username, password },
    });

    // Capture the token from the response body
    const token = response.data.token;
    
    if (!token) {
        throw new Error("Handshake failed: Token not found in response body.");
    }

    // Return it in an expected format for cookies
    return token;
  }
}

module.exports = new AuthProvider();