require('dotenv').config();
const Hapi = require('hapi');

const envset = {
  production: process.env.NODE_ENV === 'production',
};

const host = envset.production ? (process.env.HOSTNAME || process.env.HOSTNAME) : 'localhost';
const port = envset.production ? (process.env.PORT || process.env.PORT) : 4000;
const server = new Hapi.Server();

server.connection({ host, port, routes: { cors: true } });

const routes = require('./routes')(server);

server.route(routes);

server.start(() => console.log(`Server started at: ${server.info.uri}`));
