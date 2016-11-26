const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const path = require('path');
const HapiSwagger = require('hapi-swagger'); 

const swaggerOptions = {
  apiVersion: '1.0.0',
  origins: ['http://localhost:3000'],
};

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 1400,
});

const routes = require('./routes')(server);

global.appRoot = path.resolve(__dirname);

// Export the server to be required elsewhere.
module.exports = server;

// Start the server
server.register([
  Inert,
  Vision,
  {
	  register: HapiSwagger,
    options: swaggerOptions,
  }], function (err) {
  server.views({
    path: './views',
    engines: {
      html: require('swig')
    }
  })
  server.route(routes)
  server.start(() => console.log('Server started at: ' + server.info.uri))
})