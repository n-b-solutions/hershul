const fs = require('fs');
const path = require('path');

module.exports = {
  async up(db, client) {
    try {
      // טוען נתוני JSON מהתיקיה 'data'
      const roomStatusData = JSON.parse(fs.readFileSync(path.join(__dirname,'..', 'data', 'statusRoom.json')));
      const minyanData = JSON.parse(fs.readFileSync(path.join(__dirname,'..', 'data', 'minyan.json')));
      const messageData = JSON.parse(fs.readFileSync(path.join(__dirname,'..', 'data', 'messageRoom.json')));

      // מכניס נתונים ל-collections
      await db.collection('rooms').insertMany(roomStatusData);
      await db.collection('minyans').insertMany(minyanData);
      await db.collection('messages').insertMany(messageData);

      console.log("Data has been inserted into the database");
    } catch (error) {
      console.error("Error during migration up:", error);
    }
  },

  async down(db, client) {
    try {
      // אופציונלי - קוד לביטול המיגרציה
      await db.collection('status_rooms').deleteMany({});
      await db.collection('minyans').deleteMany({});
      await db.collection('messages').deleteMany({});
      
      console.log("Data has been removed from the database");
    } catch (error) {
      console.error("Error during migration down:", error);
    }
  }
};
