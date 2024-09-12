module.exports = {
  async up(db, client) {
    await db.collection('minyans').updateMany({}, { $unset: { announcement: "" } });

  },

  async down(db, client) {
  
  }
};
