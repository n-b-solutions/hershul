const { HDate } = require('@hebcal/core');

module.exports = {
  async up(db) {
    try {
      const minyans = await db.collection("minyans").find().toArray();
      for (const minyan of minyans) {
        if (minyan.specificDate && minyan.specificDate.date) {
          const specificDate = new Date(minyan.specificDate.date);
          if (!isNaN(specificDate.getTime())) {
            const hDate = new HDate(specificDate);
            minyan.specificDate.hebrewMonth = hDate.getMonthName();
            minyan.specificDate.hebrewDayMonth = hDate.getDate().toString();
          }
        }
        if (minyan.inactiveDates) {
          for (const inactiveDate of minyan.inactiveDates) {
            if (inactiveDate.date) {
              const specificDate = new Date(inactiveDate.date);
              if (!isNaN(specificDate.getTime())) {
                const hDate = new HDate(specificDate);
                inactiveDate.hebrewMonth = hDate.getMonthName();
                inactiveDate.hebrewDayMonth = hDate.getDate().toString();
              }
            }
          }
        }
        await db.collection("minyans").updateOne(
          { _id: minyan._id },
          { $set: minyan }
        );
      }
      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Error during migration up:', error);
    }
  },

  async down(db) {
    try {
      const minyans = await db.collection("minyans").find().toArray();
      for (const minyan of minyans) {
        if (minyan.specificDate) {
          minyan.specificDate.hebrewMonth = undefined;
          minyan.specificDate.hebrewDayMonth = undefined;
        }
        if (minyan.inactiveDates) {
          for (const inactiveDate of minyan.inactiveDates) {
            inactiveDate.hebrewMonth = undefined;
            inactiveDate.hebrewDayMonth = undefined;
          }
        }
        await db.collection("minyans").updateOne(
          { _id: minyan._id },
          { $set: minyan }
        );
      }
      console.log('Rollback completed successfully!');
    } catch (error) {
      console.error('Error during migration down:', error);
    }
  },
};