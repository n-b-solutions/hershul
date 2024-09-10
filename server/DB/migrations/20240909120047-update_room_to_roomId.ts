module.exports = {
  async up(db, client) {
    try {
      const rooms = db.collection("rooms").find();
      rooms.forEach(async (r) => {
        await db
          .collection("minyans")
          .updateMany({ room: r.nameRoom }, { $set: { room: r._id } });
      });
      db.collection("minyans").updateMany(
        {},
        { $rename: { room: "roomId" } },
        false,
        true
      );
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },

  async down(db, client) {
    try {
      const rooms = db.collection("rooms").find();
      rooms.forEach(async (r) => {
        await db
          .collection("minyans")
          .updateMany({ roomId: r._id }, { $set: { roomId: r.nameRoom } });
      });
      db.collection("minyans").updateMany(
        {},
        { $rename: { roomId: "room" } },
        false,
        true
      );
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },
};
