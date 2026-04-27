const api = require('./ApiClient');
const config = require('../config');

class AuthProvider {
    async login(username = config.adminUser, password = config.adminPass) {
        const response = await api.request({
            method: 'post',
            url: '/api/auth/login',
            data: { username, password }
        });

        const token = response.data?.token;

        if (!token) {
            throw new Error('🔴 AUTH FAILURE: Token not found in response body.');
        }

        return token;
    }
}

module.exports = new AuthProvider();