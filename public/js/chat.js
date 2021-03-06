const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $messageFormLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
   const $newMessage = $messages.lastElementChild;

   const newMessageStyles = getComputedStyle($newMessage);
   const newMessageMargin = parseInt(newMessageStyles.marginBottom);
   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

   const visibleHeight = $messages.offsetHeight;

   const containerHeight = $messages.scrollHeight;

   const scrollOffset = $messages.scrollTop + visibleHeight;

   if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight;
   }
}

socket.on('message', ({ text, username, createdAt }) => {
   const html = Mustache.render(messageTemplate, {
      username,
      message: text,
      createdAt: moment(createdAt).format('hh:mm a'),
   });

   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});

socket.on('location', ({ text, username, createdAt }) => {
   const html = Mustache.render(locationTemplate, {
      username,
      location: text,
      createdAt: moment(createdAt).format('hh:mm a'),
   });

   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
});

socket.on('roomData', ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, {
      room,
      users
   });

   document.querySelector('#sidebar').innerHTML = html;
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
   e.preventDefault();
   $messageFormButton.setAttribute('disabled', 'disabled');

   const message = e.target.elements.message.value;

   socket.emit('userMessage', message, (error) => {
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = '';
      $messageFormInput.focus();

      if (error) {
         return console.log(error);
      }
   });
});

document.querySelector('#send-location').addEventListener('click', () => {
   $messageFormLocationButton.setAttribute('disabled', 'disabled');

   if (!navigator.geolocation) {
      return alert('Geolocation is not suported by your browser');
   }

   navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      socket.emit('userPosition', { latitude, longitude }, (error) => {
         if (error) {
            console.log(error);
         }

         $messageFormLocationButton.removeAttribute('disabled');
      });
   })
})

socket.emit('join', { username, room }, (error) => {
   if (error) {
      alert(error);
      location.href = '/';
   }
});