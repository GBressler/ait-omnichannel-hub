const api = require('./ApiClient');

class RoomProvider {
  async createRoom(token) {
    console.log("[API] Creating a new test room...");
    
    // Dynamic data so tests don't collide

    const roomData = {
        roomName: `Automation - Suite-${Math.floor(Math.random() * 1000)}`,
        type: "Suite",
        accessible: true,
        image: "https://automationintesting.online/images/room3.jpg",
        description: "A high-end suite for automated testing verification.",
        roomPrice: 200,
        features: ["WiFi", "TV"]
    };

    const response = await api.request({
      method: 'post',
      url: '/api/room/', 
      data: roomData,
      headers: {
        'cookie': `token=${token}`
      }
    });
// ... after the await api.request ...

    // Since the response is just { "success": true }, we fetch the list to find our room
    console.log("[API] Fetching all rooms to retrieve the new ID...");
    const listResponse = await api.request({
      method: 'get',
      url: '/api/room/'
    });

    // The rooms are usually in an array under 'rooms'
    const rooms = listResponse.rooms || listResponse.data.rooms;
    const newRoom = rooms[rooms.length - 1]; // Get the most recent one
    
    const roomId = newRoom.roomid;

    console.log(`[API] Room created successfully. ID: ${roomId}`);
    return newRoom;
  }
}

module.exports = new RoomProvider();