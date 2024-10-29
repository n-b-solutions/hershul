module.exports = {
  async up(db) {
    try {
      // Add the ipAddress field with a default value only if it does not exist
      await db.collection("rooms").updateMany(
        { ipAddress: { $exists: false } },
        {
          $set: { ipAddress: "0.0.0.0" }, // Default value, change as needed
        }
      );
      console.log(
        "ipAddress field added to rooms where it did not exist successfully!"
      );
    } catch (error) {
      console.error("Error during migration up:", error);
    }
  },

  async down(db) {
    try {
      // Remove the ipAddress field from all rooms
      await db.collection("rooms").updateMany(
        {},
        {
          $unset: { ipAddress: "" },
        }
      );
      console.log("ipAddress field removed from all rooms successfully!");
    } catch (error) {
      console.error("Error during migration down:", error);
    }
  },
};
