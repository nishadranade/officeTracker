
// import { Server } from './server-routing';
const Server = require('./server-routing.js');

const server = new Server();
server.listen(process.env.PORT || 8080);
