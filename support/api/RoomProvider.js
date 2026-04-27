const api = require('./ApiClient');

class RoomProvider {
  async createRoom(token) {
    const roomName = `Automation Testing - ${Date.now()}`;
    const roomData = {
      roomName,
      type: 'Family',
      accessible: true,
      image: 'https://automationintesting.online/images/room3.jpg',
      description: 'API-automated room for testing purposes.',
      roomPrice: 199,
      features: ['WiFi', 'TV', 'Safe']
    };

    await api.request({
      method: 'post',
      url: '/api/room/',
      data: roomData,
      headers: { cookie: `token=${token}` }
    });

    const listResponse = await api.request({ method: 'get', url: '/api/room/' });
    const rooms = listResponse.rooms ?? listResponse.data?.rooms ?? listResponse.data ?? [];
    const newRoom = rooms.find(r => r.roomName === roomName);

    if (!newRoom) {
      throw new Error(`Room "${roomName}" was not found after creation.`);
    }

    return newRoom;
  }

  async deleteRoom(token, roomId) {
    await api.request({
      method: 'delete',
      url: `/api/room/${roomId}`,
      headers: { cookie: `token=${token}` }
    });
  }
}

module.exports = new RoomProvider();