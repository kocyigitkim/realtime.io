const rtServer = require('./server/RealtimeIOServer');
const rtServerOptions = require('./server/RealtimeIOServerOptions');

const server = new rtServer(new rtServerOptions(null, 5000,null,null,null,null,true));
server.listen();