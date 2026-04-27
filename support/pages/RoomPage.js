const config = require('../config');

class RoomPage {
    get roomContainer() { return $('section#rooms div.row.g-4'); }

    roomCard(description) {
        return $(`p*=${description}`);
    }

    async open() {
        await browser.url(config.baseUrl);
    }

    async verifyRoomExists(description) {
        const card = this.roomCard(description);
        await card.waitForExist({ timeout: 10000 });
        await card.scrollIntoView();
        await expect(card).toBeDisplayed();
    }
}

module.exports = new RoomPage();