module.exports = {
  async up(db) {
    try {
      // Unset the bulbStatus field from all rooms
      await db.collection("rooms").updateMany(
        {},
        {
          $unset: { bulbStatus: "" },
        }
      );
      console.log("bulbStatus field removed from all rooms successfully!");
    } catch (error) {
      console.error("Error during migration up:", error);
    }
  },

  async down(db) {
    try {
      // Optionally, you can set a default value for bulbStatus if needed
      await db.collection("rooms").updateMany(
        {},
        {
          $set: { bulbStatus: "off" }, // Default value, change as needed
        }
      );
      console.log("bulbStatus field added back to all rooms successfully!");
    } catch (error) {
      console.error("Error during migration down:", error);
    }
  },
};