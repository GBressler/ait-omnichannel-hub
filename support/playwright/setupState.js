const fs = require('fs');
const path = require('path');
// 1. Manually construct the absolute path
const authProviderPath = path.join(__dirname, '..', 'api', 'AuthProvider.js');

// 2. DEBUG: Verify the file exists on disk before requiring
if (!fs.existsSync(authProviderPath)) {
    console.error(`❌ CRITICAL ERROR: AuthProvider not found at: ${authProviderPath}`);
    process.exit(1);
}

// 3. Import using the verified path
const AuthProvider = require(authProviderPath);

async function generateStorageState() {
    console.log("Generating Playwright Storage State...");
    
    // 1. Get the token from your existing provider
    const token = await AuthProvider.login('admin', 'password');
    
    // 2. Define the storage structure
    const storage = {
        cookies: [
            {
                name: 'token',
                value: token,
                domain: 'automationintesting.online',
                path: '/',
                expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
                httpOnly: false,
                secure: false, // Site is HTTP/HTTPS mixed sometimes
                sameSite: 'Lax'
            }
        ],
        origins: []
    };

    // 3. Save to a file Playwright can read
    const filePath = path.resolve(__dirname, '../../playwright/.auth/storageState.json');
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    fs.writeFileSync(filePath, JSON.stringify(storage, null, 2));
    console.log(`Storage state saved to: ${filePath}`);
}

module.exports = generateStorageState;