// Handlers for all Android APIs

const http = require('http');

async function trialHandler(req, res){
  console.log("port is " + this.port);
  // res.send("Hello World!");
  res.sendFile('./static/index.html', {root: __dirname});
}


async function checkInHandler(request, response){
  // will be "bind"ed to the "this" of the Server object
  // make a new entry in the log
  console.log("in the check-in handler");
}

exports.trialHandler = trialHandler
