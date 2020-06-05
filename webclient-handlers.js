// all handlers related to dynamic web-client operations
const http = require('http');

async function homepageHandler(req, res){
  console.log("port is " + this.port); //ensure access to server-routing's"this"
  // res.send("Hello World!");
  var db = this.db;

  // output tables to console for debugging
  db.serialize(function () {
      db.all("select name from sqlite_master where type='table'", function (err, tables) {
          console.log(tables);
      });
  });
  res.type('html');
  res.sendFile('./p3.html', {root: './static'});
}

async function addEmployeeHandler(req, res){
  var db = this.db;
  console.log("Req: " + req.data);
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  var userID = firstName + "." + lastName
  var addEmployeeSql =`INSERT INTO users (userID, firstName, lastName, email) VALUES(?, ?, ?, ?)`;
  await db.run(addEmployeeSql, [userID, firstName, lastName, email] , function(err) {
    if (err) {
      console.log(err.message);
      res.write(JSON.stringify({
        result: "error"
      }));
    }
    else{
      console.log("Employee registered Successfully!\n" +
        "UserID: " + userID, "\nFirstName: " + firstName + "\nLastName: "+ lastName +
        "\nEmail: " + email);
      res.write(JSON.stringify({
          result: "success",
          userID: userID,
          firstName: firstName,
          lastName: lastName,
          email: email
      }));
      res.end();
    }
  });
}

async function getEmployeeHandler(req, res){
  var db = this.db;
  var email = req.body.email;
  var getEmployeeSql = `SELECT * FROM users WHERE email = ?`;
  await db.get(getEmployeeSql, [email], (err, row) => {
    if (err) {
      console.log(err.message);
      res.write(JSON.stringify({
        result: "error"
      }));
    }

    if(row == null){
      res.write(JSON.stringify({
        result: "failure"
      }));
     }
     else{
       console.log("Successfully accessed employee data\n" +
         "UserID: " + row.userID + "\nFirstName: " + row.firstName + "\nLastName: "+ row.lastName +
         "\nEmail: " + row.email);
       res.write(JSON.stringify({
         result: "success",
         userID: row.userID,
         fname: row.firstName,
         lname: row.lastName,
         email: row.email
       }));
       res.end();
      }
});
}

async function trackpageHandler(req, res){

}

async function addRoomHandler(req, res){
  var db = this.db;
  var roomName = req.body.rname;
  var roomID = generateID();
  var addRoomSql = `INSERT INTO rooms (roomID, qrCode, roomName)	VALUES (?, ?, ?)`;
  await db.run(addRoomSql, [roomID, roomID, roomName], (err, row) => {
    if (err) {
      console.log(err.message);
      res.write(JSON.stringify({
        result: "error"
      }));
    }
    else{
      console.log("Successfully added room!\n" +
        "roomName: " + roomName);
      res.write(JSON.stringify({
        result: "success",
        message: "For QR code, use \"Generate QR code\" Option",
        name: roomName
      }));
      res.end();
    }
});

}

async function getRoomIDHandler(req, res){
  var db = this.db;
  var roomName = req.body.rname;
  var selectRoomByNameSql = `SELECT roomID FROM rooms WHERE roomName = ?`;
  await db.get(selectRoomByNameSql, [roomName], (err, row) => {
    if (err) {
      console.log(err.message);
      res.write(JSON.stringify({
        result: "error"
      }));
    }

    if(row == null){
      res.write(JSON.stringify({
        result: "failure"
      }));
     }
     else{
       console.log("Successfully accessed room ID\n" +
         "RoomID: " + row.roomID);
       res.write(JSON.stringify({
         result: "success",
         roomID: row.roomID
       }));
       res.end();
      }
  });
}

async function trackDataHandler(req, res){
  var db = this.db;
  var firstName = req.body.name.split(" ")[0]
  var lastName = req.body.name.split(" ")[1];
  var userID = firstName + "." + lastName;
  userID = userID.toLowerCase();
  var startDate = req.body.startTime;
  var endDate = req.body.endTime;

  console.log(userID);
  console.log(startDate);
  console.log(endDate);

  var trackDataSql = `select u.userID as userID, r.roomName as roomName,
  v.startTime as startTime, v.endTime as endTime from visits v
    join users u on v.userID = u.userID
    join rooms r on v.roomID = r.roomID
    where ((v.startTime between ? and ?) or (v.endTime between ? and ?))
    and r.roomID in
    (
    select distinct vEmp.roomID from visits vEmp
    join users uEmp on vEmp.userID = uEmp.userID
    where ((vEmp.startTime between ? and ?) or (vEmp.endTime between ? and ?))
    and uEmp.userID = ?
    )`;
  var logSet = new Set();
  var empLogs = []
  await db.each(trackDataSql, [startDate, endDate, startDate, endDate,
      startDate, endDate, startDate, endDate, userID], (err, row) => {

    if(row == null){
      console.log("No rows were found.");
    }
    if (err) {
      console.log(err.message);
      res.write(JSON.stringify({
        result: "error"
      }));
    }
    else{
      console.log("Added to logs and empLogs!" + row.roomName + " " + row.startTime
      + " " + row.endTime + " " + row.userID);
      logSet.add([row.roomName, row.startTime, row.endTime]);
      empLogs.push([row.userID, row.roomName, row.startTime, row.endTime]);
    }
  });

  var logs;
  logs = Array.from(logSet);
  // logSet.forEach((item, i) => {
  //   logs.push(item);
  // });

  console.log("Here");
  console.log(logs);
  console.log(empLogs);

  console.log("Successfully tracked data for " + req.body.name);
  await res.write(JSON.stringify({
    result: "success",
    logs: logs,
    empLogs: empLogs
  }));
  res.end();
}

function generateID (){
  let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ID_LENGTH = 8;
  var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
      rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}

exports.homepageHandler = homepageHandler;
exports.addEmployeeHandler = addEmployeeHandler;
exports.getEmployeeHandler = getEmployeeHandler;
exports.trackpageHandler = trackpageHandler;
exports.addRoomHandler = addRoomHandler;
exports.getRoomIDHandler = getRoomIDHandler;
exports.trackDataHandler = trackDataHandler;
