const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUserById, getUserById, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
   console.log('New WebSocket connection');

   socket.on('join', ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });

      if (error) { return callback(error); }

      socket.join(user.room);
      socket.emit('message', generateMessage('Welcome', 'Admin'));
      socket.broadcast.to(user.room).
         emit('message', generateMessage(`${user.username} has joined!`, 'Admin'));

      io.to(user.room).emit('roomData', {
         room: user.room,
         users: getUsersInRoom(user.room),
      })

      callback();
   });

   socket.on('userMessage', (message, callback) => {
      const filter = new Filter();
      const user = getUserById(socket.id);

      if (filter.isProfane(message)) {
         return callback('Bad words are not allowed in this conversation.');
      }

      io.to(user.room).emit('message', generateMessage(message, user.username));
      callback();
   });

   socket.on('userPosition', ({ latitude, longitude }, callback) => {
      const user = getUserById(socket.id);

      io.to(user.room).emit('location',
         generateMessage(`https://google.com/maps?q=${latitude},${longitude}`, user.username));
      callback();
   });

   socket.on('disconnect', () => {
      const user = removeUserById(socket.id);

      if (user) {
         io.to(user.room).emit('message', 
            generateMessage(`${user.username} has left!`, 'Admin'));
         io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
         })
      }
   });
});

server.listen(port, () => {
   console.log(`App listening on port ${port}`);
});