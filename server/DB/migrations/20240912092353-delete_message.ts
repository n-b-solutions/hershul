module.exports = {
  async up(db, client) {
    await db.collection('minyans').updateMany({}, { $unset: { messages: "" } });

  },

  async down(db, client) {
  
  }
};
