const api = require('./ApiClient');
const config = require('../config');

class AuthProvider {
    async login() {
        const payload = {
            username: config.apiUsername,
            password: config.apiPassword
        };
        return await api.post(config.authApiUrl, payload);
    }
}

module.exports = new AuthProvider();