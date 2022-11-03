// https://web.dev/push-notifications-server-codelab/
// https://itnext.io/react-push-notifications-with-hooks-d293d36f4836
// https://www.section.io/engineering-education/push-notification-in-nodejs-using-service-worker/

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../api/data/voxdomini.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the voxdomini database.');
  });

  db.serialize(() => {
    db.each(`SELECT id,name FROM user`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + "\t" + row.name);
    });
  });
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  
// Create a list containing up to 500 registration tokens.
// These registration tokens come from the client FCM SDKs.
const registrationTokens = [
    'fiKCK3v8dWwwQCccEOW7af:APA91bHm8Tug5iLYZgkpLgmNgQeelidGKfzApmfJtCkBVefPdXM-sJ9H-qTRRicMHFDjq7mtoEWecoZWs2KZRJPrcwYWQJBWrnJvO_sTt6exVU2M0C7xHwmJybz9h3Usfw0Z_NjY-gID',
  ];
  
  const message = {
    data: {score: '850', time: '2:45'},
    tokens: registrationTokens,
  };
  
  getMessaging().sendMulticast(message)
    .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
    });
  
    //https://nodejs.org/en/docs/guides/timers-in-node/
  let value = 0
  function intervalFunc(v) {
    v++;
    console.log('Cant stop me now!' + v);
  }
  
  setInterval(intervalFunc, 1500,value);