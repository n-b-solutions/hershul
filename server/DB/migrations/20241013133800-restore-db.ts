module.exports = {
  async up(db) {},

  async down(db) {
    try {
      db.dropDatabase();
      console.log("All the collections removed successfully!");
    } catch (error) {
      console.log("Error during migration down:", error);
    }
  },
};
