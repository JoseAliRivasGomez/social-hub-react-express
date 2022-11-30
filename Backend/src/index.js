const { Publisher } = require('./controllers/posts.controller');
const Server = require('./models/server');

require('dotenv').config();

const server = new Server();

server.listen();

const publisher = new Publisher();
