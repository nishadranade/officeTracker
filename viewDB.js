// Outputs a list of all the data in the tables of the DB
// Change the dbName constant if not working with the backup
const sqlite3 = require('sqlite3').verbose();
const dbName = 'trackerDB.backup.db'

let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(() => {

  let userQuery = `SELECT * FROM users`;
  db.each(userQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    console.log("Userid: ", row.userID);
    console.log("firstName: ", row.firstName);
    console.log("lastName: ", row.lastName);
    console.log("email: ", row.email, "\n");
  });

  let roomQuery = `SELECT * FROM rooms`;
  db.each(roomQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    console.log("roomID: ", row.roomID);
    console.log("qrCode: ", row.qrCode);
    console.log("roomName: ", row.roomName, "\n");
  });

  let visitQuery = `SELECT * FROM visits`;
  db.each(visitQuery, [], (err, row) => {
    if (err) {
      throw err;
    }
    console.log("visitID: ", row.visitID);
    console.log("userID: ", row.userID);
    console.log("roomID: ", row.roomID);
    console.log("startTime: ", row.startTime);
    console.log("endTime: ", row.endTime, "\n");
  });
});
