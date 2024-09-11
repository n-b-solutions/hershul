module.exports = {
  async up(db, client) {
    await db.collection('minyans').updateMany(
      { steadyFlag: { $exists: false } }, 
      { $set: { steadyFlag: false } }   
    )
  },

  async down(db, client) {
    await db.collection('minyans').updateMany(
      { steadyFlag: { $exists: true } }, 
      { $unset: { steadyFlag: "" } }     
  );
  }
};
