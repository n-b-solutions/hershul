const fs = require('fs');
const path = require('path');

module.exports = {
  async up(db, client) {
    const minyanData = JSON.parse(fs.readFileSync(path.join(__dirname,'..', 'data', 'minyan.json')));
    await db.collection('minyans').deleteMany({});
    await db.collection('minyans').insertMany(minyanData);

  },

  async down(db, client) {
    await db.collection('minyans').deleteMany({});
 
  }
};
