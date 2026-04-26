const auth = require('./common/api/AuthProvider');

(async () => {
  console.log("Testing Auth Handshake...");
  try {
    const token = await auth.login();
    console.log("Success! Token captured:", token[0].split(';')[0]);
  } catch (e) {
    console.error("Auth Failed:", e.message);
  }
})();