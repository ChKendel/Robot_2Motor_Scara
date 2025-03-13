const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Serve static files 
app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));


const GCodeReceiver = require('./services/GCodeReceiver.js')
const receiver = new GCodeReceiver();

const SimWebSocket = require('./services/SimWebSocket.js')
const simWS = new SimWebSocket(server, receiver);

const port = process.env.RUN_PORT || 5080

server.listen(port, () => {
    console.log(`Server is running on http://localhost:`,port);
});
