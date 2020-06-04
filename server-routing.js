// giant collection of all server routes

const http = require('http');
const express = require('express');
const path = require('path');
const android = require('./android-handlers');
const web = require('./webclient-handlers');

class Server {

  constructor(db){
    this.server = express();
    this.port = process.env.PORT || 8080;
    this.db = db;

    this.listen = function (port) {
      return this.server.listen(port);
    }
    this.router = express.Router();
    this.router.use((request, response, next) => {
      response.header('Content-Type', 'application/json');
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Headers', '*');
      next();
    });

  // Serve static pages from a particular path.
    // Handle POST data as JSON
    this.server.use(express.json());
    this.server.use('/', this.router);
    this.server.use(express.static('static'));

    // Android related URLs
    this.router.post('/login', android.loginHandler.bind(this));
    this.router.post('/checkIn', android.checkInHandler.bind(this));
    this.router.post('/checkOut', android.checkOutHandler.bind(this));

    // this.server.get('/', android.trialHandler.bind(this));
    this.server.get('/home/', web.homepageHandler.bind(this));

    // add employee dummy script
    this.router.post('/addEmployee', function(req, res){
      res.write(JSON.stringify({
          result: "success"
      }));
      res.end();
    });
  }
}

module.exports = Server
