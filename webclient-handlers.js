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
          result: "success"
      }));
    }
  });
}

async function getEmployeeHandler(req, res){

}

async function trackpageHandler(req, res){

}

exports.homepageHandler = homepageHandler;
exports.addEmployeeHandler = addEmployeeHandler;
exports.getEmployeeHandler = getEmployeeHandler;
exports.trackpageHandler = trackpageHandler;
