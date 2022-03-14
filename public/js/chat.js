const socket = io();

socket.on('countUpdate', (count) => {
   console.log('The count has been update');
   console.log(count);
});

document.querySelector('#increment').addEventListener('click', () => {
   console.log('Clicked');
   socket.emit('increment');
})