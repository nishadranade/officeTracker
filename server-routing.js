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
    this.server.get('/track/', web.trackpageHandler.bind(this));
    this.server.get('/qrcode/', (req, res) => {
      res.type('html');
      res.sendFile('./p2.html', {root: './static'});
    });

    // add employee dummy script
    this.router.post('/addEmployee', web.addEmployeeHandler.bind(this));
    this.router.post('/getEmployee', web.getEmployeeHandler.bind(this));
    this.router.post('/addRoom',web.addRoomHandler.bind(this));
    this.router.post('/getRoomID',web.getRoomIDHandler.bind(this));
    this.router.post('/getData',web.trackDataHandler.bind(this));

	  // replace the anonymous function that sends dummy data with trackPageHandler
    this.router.post('/getData', (req, res) => {
      res.write(JSON.stringify({
        result: "success",
        logs: [["Cambridge", "2020-06-04 09:00:00.000","2020-06-04 10:00:00.000"], ["Boston", "2020-06-04 09:00:00.000","2020-06-04 10:00:00.000"]],
        empLogs: [["andrew", "Cambridge", "2020-06-04 09:00:00.000","2020-06-04 10:00:00.000"], ["ayush", "Boston", "2020-06-04 09:00:00.000", "2020-06-04 10:00:00.000"]]
      }));
      res.end();
    })
  }
}

module.exports = Server
