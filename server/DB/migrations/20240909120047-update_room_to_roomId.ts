module.exports = {
  async up(db, client) {
    try {
      const rooms = await db.collection("rooms").find();
      await rooms.forEach(async (r) => {
        await db
          .collection("minyans")
          .updateMany({ room: r.nameRoom }, { $set: { room: r._id } });
      });
      await db
        .collection("minyans")
        .updateMany({}, { $rename: { room: "roomId" } }, false, true);
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },

  async down(db, client) {
    try {
      const rooms = await db.collection("rooms").find();
      await rooms.forEach(async (r) => {
        await db
          .collection("minyans")
          .updateMany({ roomId: r._id }, { $set: { roomId: r.nameRoom } });
      });
      await db.collection("minyans").updateMany(
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
