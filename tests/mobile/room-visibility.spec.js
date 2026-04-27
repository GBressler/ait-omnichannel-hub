const AuthProvider = require('../../support/api/AuthProvider');
const RoomProvider = require('../../support/api/RoomProvider');
const RoomPage = require('../../support/pages/RoomPage');

describe('Mobile Customer Portal - Visibility Check', () => {
    let testRoom;
    let token;

    before(async () => {
        token = await AuthProvider.login();

        const listResponse = await require('../../support/api/ApiClient').request({ method: 'get', url: '/api/room/' });
        const rooms = listResponse.rooms ?? listResponse.data?.rooms ?? listResponse.data ?? [];
        for (const room of rooms) {
            await RoomProvider.deleteRoom(token, room.roomid);
        }

        testRoom = await RoomProvider.createRoom(token);
    });

    after(async () => {
        if (testRoom?.roomid) {
            await RoomProvider.deleteRoom(token, testRoom.roomid);
        }
    });

    it('should show the API-created room on the front-end list', async () => {
        await RoomPage.open();
        await RoomPage.verifyRoomExists('API-automated room for testing purposes.');
    });
});