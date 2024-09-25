module.exports = {
  async up(db, client) {
    await db.collection('minyans').updateMany(
      { dateType: 'calendar' }, // סינון לפי סוג ה-minyan
      { $set: { specificDate: { date: null, isRoutine: false } } } // הוספת הנתונים
    );
  },

  async down(db, client) {
    await db.collection('minyans').updateMany(
      { dateType: 'calendar' }, // סינון לפי סוג ה-minyan
      { $unset: { specificDate: "" } } // הסרת הנתונים
    );
  }
};
