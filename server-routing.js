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
    this.router.use((request, resposne, next) => {
      response.header('Content-Type', 'application/json');
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Headers', '*');
      next();
    });

    // this.server.get('/', android.trialHandler.bind(this));
    this.server.get('/', web.homepageHandler.bind(this));
  }
}

module.exports = Server
