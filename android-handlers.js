// Handlers for all Android APIs

const http = require('http');

// {username: "liam"};

async function loginHandler(req, res){
  var username = req.body.username;
  // check if user exists (not coded yet)
  console.log("attempt at logging in");
  res.write(JSON.stringify({
    result: "success"
  }));
  res.end();
}

async function checkInHandler(request, response){
  // will be "bind"ed to the "this" of the Server object
  // make a new entry in the log
  console.log("in the check-in handler");
  response.write(JSON.stringify({
    result: "success"
  }));
}

async function checkOutHandler(request, response){
  // update existing entry in the log functionality not yet coded
  console.log("in the checkout handler");
  response.write(JSON.stringify({
    result: "success"
  }));
}

exports.trialHandler = trialHandler
