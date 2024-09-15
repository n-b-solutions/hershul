module.exports = {
  async up(db, client) {
    await db.collection('minyans').deleteMany({});

    await db.collection('minyans').insertMany(
      [
        {
          "roomId": "66d592a6436d5a643e9720a2",
          "messages": "room1 message",
          "announcement": true,
          "startDate": {
            "time": "2024-08-20T13:00:00.000Z",
            "messageId": "66d989edad22ae590e13440e"
          },
          "endDate": {
            "time": "2024-08-20T13:05:00.000Z",
            "messageId": "66d98a73ad22ae590e134419"
          },
          "blink": {
            "secondsNum": 4,
            "messageId": "66e17aa716c4be1380e2b42c"
          },
          "steadyFlag": true,
          "dateType": "sunday"
        },
        {
          "roomId": "66d592a6436d5a643e9720a3",
          "messages": "room2 message",
          "announcement": false,
          "startDate": {
            "time": "2024-08-21T14:00:00.000Z",
            "messageId": "66e17aa716c4be1380e2b42c"
          },
          "endDate": {
            "time": "2024-08-21T14:05:00.000Z",
            "messageId": "66d98a73ad22ae590e134419"
          },
          "blink": {
            "secondsNum": 6,
            "messageId": "66d989edad22ae590e13440e"
          },
          "steadyFlag": false,
          "dateType": "monday"
        },
        {
          "roomId": "66d592a6436d5a643e9720a4",
          "messages": "room3 message",
          "announcement": true,
          "startDate": {
            "time": "2024-08-22T15:00:00.000Z",
            "messageId": "66d98a73ad22ae590e134419"
          },
          "endDate": {
            "time": "2024-08-22T15:05:00.000Z",
            "messageId": "66d989edad22ae590e13440e"
          },
          "blink": {
            "secondsNum": 2,
            "messageId": "66e17aa716c4be1380e2b42c"
          },
          "steadyFlag": true,
          "dateType": "taanit"
        }
      ]
      
    )
  },

  async down(db, client) {
    await db.collection('minyans').deleteMany({});
  }
};
