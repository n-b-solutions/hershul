const { readFileSync } = require("fs");
const path = require("path");


module.exports = {
  async up(db) {
    try {
      const roomsData = JSON.parse(
        readFileSync(
          path.join(__dirname, "..", "data", "rooms.json")
        ).toString()
      );

      await db.collection("rooms").insertMany(roomsData);

      console.log("Rooms (from json) inserted successfully!");
    } catch (error) {
      console.error("Error during migration up:", error);
    }
  },

  async down(db) {
    try {
      await db.collection("rooms").deleteMany({});

      console.log("Rooms deleted successfully!");
    } catch (error) {
      console.error("Error during migration down:", error);
    }
  },
};
