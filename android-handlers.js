// Handlers for all Android APIs

const http = require('http');

// {username: "liam"};

async function loginHandler(req, res){

  var username = req.body.username;
  var db = this.db;
  
  console.log("attempt at logging in");
  console.log(username);

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
	  res.end();
    }
    else{
      res.write(JSON.stringify({
        result: "success"
      }));
	  res.end();
    }
  });

  
}

async function checkInHandler(req, res){
  console.log("in the check-in handler");
  var username = req.body.username
  var qrCode = req.body.roomId
  var db = this.db;
  var visitID = generateID()
  var startTime = new Date()

  let sql = `SELECT roomID id FROM rooms where qrCode = ?`;
  db.get(sql, [qrCode], (err, row) => {
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
      roomID = row.id;
      db.run(`INSERT INTO visits(visitID, userID, roomID, startTime) VALUES(?, ?, ?, ?)`, [visitID, username, roomID, startTime], function(err) {
        if (err) {
          console.log(err.message);
          response.write(JSON.stringify({
            result: "error"
          }));
        }
        else{
          response.write(JSON.stringify({
            result: "success"
          }));
        }
      });
    }
	
	res.end();
  });

  
}

async function checkOutHandler(req, res){
  console.log("in the checkout handler");
  var username = req.body.username
  var qrCode = req.body.roomId
  var db = this.db;
  var endTime = new Date()

  let sql = `SELECT roomID id FROM rooms where qrCode = ?`;
  db.get(sql, [qrCode], (err, row) => {
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
      roomID = row.id;
      db.run(`UPDATE visits SET endTime = ? WHERE userID = ? AND roomID = ? AND endTime IS NULL`, [endTime, username, roomID], function(err) {
        if (err) {
          console.log(err.message);
          response.write(JSON.stringify({
            result: "error"
          }));
        }
        else{
          response.write(JSON.stringify({
            result: "success"
          }));
        }
      });
    }
	
	res.end();
  });

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
