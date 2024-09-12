
module.exports = {
  async up(db, client) {
    await db.collection('minyans').deleteMany({}); // Clear the minyans collection

    try {
      // Fetch all rooms and messages
      const rooms = await db.collection('rooms').find().toArray();
      const messages = await db.collection('messages').find().toArray();

      if (!rooms.length || !messages.length) {
        console.log('No rooms or messages found, aborting...');
        return;
      }

      const getRandomMessageId = () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex]._id;
      };

      const minyans = rooms.map((room, index) => ({
        roomId: room._id, // Use the room's ObjectId
        startDate: {
          time: new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000), // 1 day later for each room
          messageId: getRandomMessageId(), // Random messageId
        },
        endDate: {
          time: new Date(new Date().getTime() + (index + 1) * 24 * 60 * 60 * 1000), // 1 day after startDate
          messageId: getRandomMessageId(), // Random messageId
        },
        blink: {
          secondsNum: 5, // Example value
          messageId: getRandomMessageId(), // Random messageId
        },
        steadyFlag: false, // Just an example condition
        dateType: index % 2 === 0 ? 'sunday' : 'monday' // Alternate between sunday and monday
      }));

      await db.collection('minyans').insertMany(minyans);
      console.log('Dummy minyans inserted successfully!');
    } catch (error) {
      console.log('Error during migration up:', error);
    }
  },

  async down(db, client) {
    try {
      await db.collection('minyans').deleteMany({}); // Remove all minyans
      console.log('Dummy minyans removed successfully!');
    } catch (error) {
      console.log('Error during migration down:', error);
    }
  },
};
