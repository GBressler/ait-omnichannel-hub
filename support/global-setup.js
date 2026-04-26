const path = require('path');
const fs = require('fs');
const auth = require('../common/api/AuthProvider'); // Check this path!

async function globalSetup() {
  const token = await auth.login();
  
  // This tells the code: "Create a folder called 'auth-state' 
  // inside the playwright-web folder"
  const filePath = path.resolve(__dirname, 'auth-state/storageState.json');
  const folderPath = path.dirname(filePath);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Define the passport object
  const storageState = {
    cookies: [{
      name: 'token',
      value: token,
      domain: 'automationintesting.online',
      path: '/',
      httpOnly: false, // Adjusted for typical web access
      secure: true,
      sameSite: 'Strict'
    }],
    origins: []
  };

  fs.writeFileSync(filePath, JSON.stringify(storageState, null, 2));
}

module.exports = globalSetup;