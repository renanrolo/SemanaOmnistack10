const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require('http');
const cors = require('cors');
const { setupWebsockets } = require('./websocket');
const { MONGO_STRING_CONNECTION } = require('./.env')

const app = express();
const server = http.Server(app);

setupWebsockets(server);

mongoose.connect(MONGO_STRING_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json());
app.use(routes);

server.listen(3333);