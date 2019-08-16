'use strict';
import routes from './api';

const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({ 
    host: 'localhost', 
    port: 8001
});

// Add the route
// server.route(routes);  //Getting Assertion Error, It accepts object as value, but here passing array 'routes'.
routes.forEach(el => {
    el.forEach(obj => {
        server.route(obj);
    });
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();