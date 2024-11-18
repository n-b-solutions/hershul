module.exports = {
  async up(db) {
    try {
      // Create a new collection named 'luach_minyans'
      await db.createCollection("luach_minyans");
      console.log("luach_minyans collection created successfully!");
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },

  async down(db) {
    try {
      // Drop the 'luach_minyans' collection
      await db.collection("luach_minyans").drop();
      console.log("luach_minyans collection dropped successfully!");
    } catch (error) {
      console.log("Error during migration down:", error);
    }
  },
};
