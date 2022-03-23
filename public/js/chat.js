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

socket.on('message', (message) => {
   console.log(message);

   const html = Mustache.render(messageTemplate, {
      message
   });

   $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (location) => {
   console.log(location);

   const html = Mustache.render(locationTemplate, {
      location
   });
   
   $messages.insertAdjacentHTML('beforeend', html);
});

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