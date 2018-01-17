'use strict';
import routes from './api';
import * as fs from 'fs';
const Hapi = require('hapi');
const UPLOAD_PATH = 'uploads';
const fileOptions = {
  dest: `${UPLOAD_PATH}/`
};
if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8001
});

// Add the route
server.route(routes);

// Start the server
async function start() {

  try {
    server.start();
  } catch (err) {
    process.exit(1);
  }
  // server.on('response', function(request) {
  //   console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
  //   console.log('Request payload:', request.payload);
  //   console.log('Response payload:', request.response.source);
  // });
  console.log('Server running at:', server.info.uri);

};


start();
