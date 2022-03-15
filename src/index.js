const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
   console.log('New WebSocket connection');

   socket.emit('message', 'Welcome again!');
   socket.broadcast.emit('message', 'A new user has joined!');

   socket.on('userMessage', (message) => {
      io.emit('message', message);
   })
});

server.listen(port, () => {
   console.log(`App listening on port ${port}`);
});