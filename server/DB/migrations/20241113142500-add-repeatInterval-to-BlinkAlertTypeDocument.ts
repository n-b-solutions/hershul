module.exports = {
    async up(db) {
      try {
        // Add the repeatInterval field to the blink alert type in all minyans
        await db.collection("minyans").updateMany(
          { "blink": { $exists: true } },
          {
            $set: { "blink.repeatInterval": null },
          }
        );
        console.log("repeatInterval field added to blink alert type successfully!");
      } catch (error) {
        console.error("Error during migration up:", error);
      }
    },
  
    async down(db) {
      try {
        // Remove the repeatInterval field from the blink alert type in all minyans
        await db.collection("minyans").updateMany(
          { "blink.repeatInterval": { $exists: true } },
          {
            $unset: { "blink.repeatInterval": "" },
          }
        );
        console.log("repeatInterval field removed from blink alert type successfully!");
      } catch (error) {
        console.error("Error during migration down:", error);
      }
    }
  };