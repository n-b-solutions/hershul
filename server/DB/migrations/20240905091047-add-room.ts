module.exports = {
  async up(db, client) {
    const rooms = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6'];
    
    const cursor = await db.collection('messages').find();
    
    while (await cursor.hasNext()) {
      const message = await cursor.next();
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
      
      await db.collection('messages').updateOne(
        { _id: message._id },
        { 
          $set: { selectedRoom: randomRoom }, // Set selectedRoom with random value
          $unset: { room: "" } // Remove the room field
        }
      );
    }
  },

  async down(db, client) {
    const rooms = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6'];
    
    const cursor = await db.collection('messages').find();
    
    while (await cursor.hasNext()) {
      const message = await cursor.next();
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

      await db.collection('messages').updateOne(
        { _id: message._id },
        { 
          $set: { room: randomRoom }, // Restore the room field with random value
          $unset: { selectedRoom: "" } // Remove the selectedRoom field
        }
      );
    }
  }
};
