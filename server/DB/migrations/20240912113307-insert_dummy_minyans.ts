module.exports = {
  async up(db) {
    await db.collection("minyans").deleteMany({});

    try {
      const rooms = await db.collection("rooms").find().toArray();
      if (!rooms.length) {
        console.log("No rooms found, aborting...");
        return;
      }

      const messages = await db.collection("messages").find().toArray();

      const getRandomMessageId = () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex]?._id || null;
      };

      const minyans = rooms.map((room) => {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getTime() + 60 * 60 * 1000); // 1 hour after the current time
        const endDate = new Date(startDate.getTime() + 20 * 60 * 1000); // 20 minutes after the start date

        return {
          roomId: room._id,
          startDate: {
            time: startDate,
            messageId: getRandomMessageId(),
          },
          endDate: {
            time: endDate,
            messageId: getRandomMessageId(),
          },
          blink: {
            secondsNum: 5,
            messageId: getRandomMessageId(),
          },
          steadyFlag: false,
          dateType: Math.random() < 0.5 ? "sunday" : "monday", // Randomly assign "sunday" or "monday"
        };
      });

      await db.collection("minyans").insertMany(minyans);
      console.log("Dummy minyans inserted successfully!");
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },

  async down(db) {
    try {
      await db.collection("minyans").deleteMany({});
      console.log("Dummy minyans removed successfully!");
    } catch (error) {
      console.log("Error during migration down:", error);
    }
  },
};
