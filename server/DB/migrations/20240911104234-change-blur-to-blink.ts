module.exports = {
  async up(db, client) {
    await db.collection('rooms').updateMany(
      { status: 'blur' }, 
      { $set: { status: 'blink' } } 
    );
  },

  async down(db, client) {
    await db.collection('rooms').updateMany(
      { status: 'blink' }, 
      { $set: { status: 'blur' } } 
    );
  }
};
