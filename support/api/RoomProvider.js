const api = require('./ApiClient');

class RoomProvider {
  /**
   * Creates a room via API and verifies its existence in the database.
   * @param {string} token - The auth token for the session.
   * @returns {Object} The full room object including the roomid.
   */
  async createRoom(token) {
    console.log("[API] Initializing room creation sequence...");
    
    // 1. Generate unique data to prevent collisions in shared environments
    const uniqueId = Math.floor(Math.random() * 10000);
    const roomData = {
        roomName: `Automation - Suite-${uniqueId}`,
        type: "Suite",
        accessible: true,
        image: "https://automationintesting.online/images/room3.jpg",
        description: "A high-end suite for automated testing verification.",
        roomPrice: 250,
        features: ["WiFi", "TV", "Mini Bar"]
    };

    // 2. Perform the POST request
    // Note: The API returns { "success": true } but not the created ID.
    await api.request({
      method: 'post',
      url: '/api/room/', 
      data: roomData,
      headers: {
        'cookie': `token=${token}`
      }
    });

    console.log(`[API] POST successful. Searching for room: "${roomData.roomName}"`);

    // 3. Fetch all rooms to retrieve the system-generated ID
    const listResponse = await api.request({
      method: 'get',
      url: '/api/room/'
    });

    // 4. Robust array parsing (handles various Axios/API response structures)
    const rooms = listResponse.rooms || listResponse.data?.rooms || listResponse.data || [];
    
    // 5. Find the EXACT room we just created using its unique name
    const newRoom = rooms.find(r => r.roomName === roomData.roomName);

    if (!newRoom) {
      throw new Error(`[API Error]: Room "${roomData.roomName}" was not found in the listing after creation.`);
    }

    console.log(`[API] Verification Complete. Room ID: ${newRoom.roomid}`);
    
    // Return the full object so the UI test knows exactly what to assert
    return newRoom;
  }
}

module.exports = new RoomProvider();