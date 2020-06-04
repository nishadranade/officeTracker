
// import { Server } from './server-routing';
const Server = require('./server-routing.js');
const sqlite3 = require('sqlite3').verbose();

// connect to db
let db = new sqlite3.Database('tracker.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

const server = new Server(db);
server.listen(process.env.PORT || 8080);
