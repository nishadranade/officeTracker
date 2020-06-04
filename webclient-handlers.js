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

  res.sendFile('./static/index.html', {root: __dirname});
}

exports.homepageHandler = homepageHandler;
