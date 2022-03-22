const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');

socket.on('message', (message) => {
   console.log(message);
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
   if (!navigator.geolocation) {
      return alert('Geolocation is not suported by your browser');
   }

   navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      socket.emit('userPosition', { latitude, longitude });
   })
})