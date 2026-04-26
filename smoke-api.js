const auth = require('./support/AuthProvider');
const roomProvider = require('./support/RoomProvider');
const ApiClient = require('./support/ApiClient');

async function runSmoke() {
  try {
    // 1. Authenticate
    const token = await auth.login();
    console.log(" Step 1: Auth Successful.");

    // 2. Create Data
    const newRoom = await roomProvider.createRoom(token);
    console.log(` Step 2: Room "${newRoom.roomName}" is live.`);

    // 3. Status
    
    console.log(`"I've established a stateful foundation. I can verify Room ID ${newRoom.roomid} 
directly in the UI or on a Mobile device without relying on pre-existing data."`);

  } catch (error) {
    console.error(" Smoke Test Failed:", error.message);
  }
}

runSmoke();