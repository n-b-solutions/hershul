module.exports = {
  async up(db) {
    try {
      // Update startDate.time and endDate.time fields to set seconds to 00
      await db
        .collection("minyans")
        .updateMany({ "startDate.time": { $exists: true } }, [
          {
            $set: {
              "startDate.time": {
                $dateFromParts: {
                  year: { $year: "$startDate.time" },
                  month: { $month: "$startDate.time" },
                  day: { $dayOfMonth: "$startDate.time" },
                  hour: { $hour: "$startDate.time" },
                  minute: { $minute: "$startDate.time" },
                  second: 0,
                  millisecond: 0,
                },
              },
            },
          },
        ]);

      await db
        .collection("minyans")
        .updateMany({ "endDate.time": { $exists: true } }, [
          {
            $set: {
              "endDate.time": {
                $dateFromParts: {
                  year: { $year: "$endDate.time" },
                  month: { $month: "$endDate.time" },
                  day: { $dayOfMonth: "$endDate.time" },
                  hour: { $hour: "$endDate.time" },
                  minute: { $minute: "$endDate.time" },
                  second: 0,
                  millisecond: 0,
                },
              },
            },
          },
        ]);

      console.log("Migration completed successfully!");
    } catch (error) {
      console.error("Error during migration:", error);
    }
  },

  async down(db) {
    // Optionally, you can implement the down migration logic if needed
  },
};
