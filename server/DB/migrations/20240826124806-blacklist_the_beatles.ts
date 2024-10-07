const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    try {
      // טוען נתוני JSON מהתיקיה 'data'
      const roomsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "data", "rooms.json"))
      );

      // מכניס נתונים ל-collections
      await db.collection("rooms").insertMany(roomsData);

      console.log("Data has been inserted into the database");
    } catch (error) {
      console.error("Error during migration up:", error);
    }
  },

  async down(db, client) {
    try {
      await db.collection("rooms").deleteMany({});

      console.log("Data has been removed from the database");
    } catch (error) {
      console.error("Error during migration down:", error);
    }
  },
};
