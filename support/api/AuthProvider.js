const api = require('./ApiClient');
const config = require('../config'); // Adjust path as needed

class AuthProvider {
    async login() {
        const payload = {
            username: config.apiUsername, // Make sure these aren't undefined
            password: config.apiPassword
        };
        // Use your ApiClient to send this payload
        return await apiClient.post(config.authApiUrl, payload);
    }
}

module.exports = new AuthProvider();