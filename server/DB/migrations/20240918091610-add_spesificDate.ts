module.exports = {
  async up(db, client) {
    await db.collection('minyans').updateMany(
      { dateType: 'calendar' }, // סינון לפי סוג ה-minyan
      { $set: { spesificDate: { date: null, isRoutine: false } } } // הוספת הנתונים
    );
  },

  async down(db, client) {
    await db.collection('minyans').updateMany(
      { dateType: 'calendar' }, // סינון לפי סוג ה-minyan
      { $unset: { spesificDate: "" } } // הסרת הנתונים
    );
  }
};
