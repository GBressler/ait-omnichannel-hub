module.exports = {
    validRoom: {
        roomName: `Atlas-${Date.now()}`, // Dynamic name to prevent collisions
        type: "Family",
        accessible: true,
        roomPrice: 777,
        description: "A luxury suite for automation testing.",
        features: ["Mini-Bar", "TV", "Views"]
    },
    invalidRoom: {
        roomName: "", // Use this for negative testing
        roomPrice: -1
    }
};