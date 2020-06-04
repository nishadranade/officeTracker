// all handlers related to dynamic web-client operations
const http = require('http');

async function homepageHandler(req, res){
  console.log("port is " + this.port); //ensure access to server-routing's"this"
  // res.send("Hello World!");
  res.sendFile('./static/index.html', {root: __dirname});
}

exports.homepageHandler = homepageHandler;