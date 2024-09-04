const fs = require("fs");
const path = require("path");

module.exports = {
  async up(db, client) {
    try {
      const minyanData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "data", "minyan.json"))
      );
      await db.collection("minyans").insertMany(minyanData);
      console.log("Data has been inserted into the database");
    } catch (error) {
      console.log("Error during migration up:", error);
    }
  },

  async down(db, client) {
    try {
      await db.collection("minyans").deleteMany({});
      console.log("Data has been removed from the database");
    } catch (error) {
      console.log("Error during migration down:", error);
    }
  },
};
