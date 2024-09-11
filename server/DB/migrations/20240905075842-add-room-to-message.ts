module.exports = {
  async up(db, client) {
    const rooms = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6'];
    
    await db.collection('messages').updateMany(
      {}, 
      { 
        $set: { 
          room: rooms[Math.floor(Math.random() * rooms.length)] 
        } 
      }
    );
  },

  async down(db, client) {
    await db.collection('messages').updateMany(
      {}, 
      { $unset: { room: "" } } 
    );
  }
};
