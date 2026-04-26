const { test, expect } = require('@playwright/test');
const RoomProvider = require('../../support/api/RoomProvider');
const AuthProvider = require('../../support/api/AuthProvider');

test.describe('Room Management: API-to-UI Verification', () => {
  let roomData;

  test.beforeAll(async () => {
    const token = await AuthProvider.login('admin', 'password');
    roomData = await RoomProvider.createRoom(token);
    expect(roomData, 'Room must be created via API before UI verification').toBeTruthy();
  });

  test('should find the API-created room in the admin UI', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });

    const roomRow = page.locator(`#room${roomData.roomid}`);

    await expect(roomRow).toBeVisible({ timeout: 10000 });
    await expect(roomRow).toContainText(roomData.type);
    await expect(roomRow).toContainText(roomData.roomPrice.toString());
  });
});