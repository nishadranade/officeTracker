// Handlers for all Android APIs

const http = require('http');

// {username: "liam"};

async function loginHandler(req, res){

  console.log("attempt at logging in");
  console.log(username);

  var username = req.body.username;
  var db = this.db;

  let sql = `SELECT userID id FROM users where userID = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
  	   console.log(err.message)
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
      res.write(JSON.stringify({
        result: "success"
      }));
    }
  });

  res.end();
}

async function checkInHandler(req, res){
  console.log("in the check-in handler");
  var username = req.body.username
  var roomID = req.body.roomId
  var db = this.db;
  var visitID = generateID()
  var startTime = new Date()

  res.write(JSON.stringify({
    result: "success"
  }));

  // Work in progress

  // db.run(`INSERT INTO visits(visitID, userID, roomID, startTime) VALUES(?, ?, ?, ?)`, [visitID, username, roomID, startTime], function(err) {
  //     if (err) {
  //       console.log(err.message);
  //       response.write(JSON.stringify({
  //         result: "failure"
  //       }));
  //     }
  //     else{
  //       response.write(JSON.stringify({
  //         result: "success"
  //       }));
  //     }
  //   });

  res.end();
}

async function checkOutHandler(req, res){
  console.log("in the checkout handler");
  var username = req.body.username
  var roomID = req.body.roomId
  var db = this.db;
  var endTime = new Date()

  res.write(JSON.stringify({
    result: "success"
  }));


  // Work in progress

  // db.run(`UPDATE visits SET endTime = ? WHERE userID = ? AND roomID = ? AND endTime IS NULL`, [endTime, username, roomID], function(err) {
  //   if (err) {
  //     console.log(err.message);
  //     response.write(JSON.stringify({
  //       result: "failure"
  //     }));
  //   }
  //   else{
  //     response.write(JSON.stringify({
  //       result: "success"
  //     }));
  //   }
  // });

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

//exports.trialHandler = trialHandler
exports.loginHandler = loginHandler;
exports.checkInHandler = checkInHandler;
exports.checkOutHandler = checkOutHandler;
