
module.exports = {
  async up(db, client) {
    await db.collection('minyans').deleteMany({}); 

    try {
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
        roomId: room._id, 
        startDate: {
          time: new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000), 
          messageId: getRandomMessageId(), 
        },
        endDate: {
          time: new Date(new Date().getTime() + (index + 1) * 24 * 60 * 60 * 1000), 
          messageId: getRandomMessageId(), 
        },
        blink: {
          secondsNum: 5, 
          messageId: getRandomMessageId(),
        },
        steadyFlag: false,
        dateType: index % 2 === 0 ? 'sunday' : 'monday' 
      }));

      await db.collection('minyans').insertMany(minyans);
      console.log('Dummy minyans inserted successfully!');
    } catch (error) {
      console.log('Error during migration up:', error);
    }
  },

  async down(db, client) {
    try {
      await db.collection('minyans').deleteMany({}); 
      console.log('Dummy minyans removed successfully!');
    } catch (error) {
      console.log('Error during migration down:', error);
    }
  },
};
