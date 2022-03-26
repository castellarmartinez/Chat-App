const users = [];

const addUser = ({ id, username, room }) => {
   username = username.trim().toLowerCase();
   room = room.trim().toLowerCase();

   if (missingUserData(username, room)) {
      return showError('Username and room are required!');
   }

   if (userExist(room, username)) {
      return showError('Username is in use!');
   }

   const user = { id, username, room };
   users.push(user)

   return { user }
}

const removeUserById = (id) => {
   const index = users.findIndex(user => user.id === id);

   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
}

const getUserById = (id) => {
   return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
   room = room.trim().toLowerCase();

   return users.filter(user => user.room === room);
}

function missingUserData(username, room) {
   return !username || !room;
}

function userExist(room, username) {
   return users.find((user) =>
      user.room === room && user.username === username);
}

function showError(error) {
   return { error };
}

module.exports = { addUser, getUserById, getUsersInRoom, removeUserById };