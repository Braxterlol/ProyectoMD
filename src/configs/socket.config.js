const socketIo = require('socket.io');

let io;

function init(server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    socket.on('actualizar-producto', (data) => {
      console.log('Evento "actualizar-producto" recibido:', data);
      io.emit('producto-actualizado', data);
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io no está inicializado. Llama a init(server) primero.');
  }

  return io;
}

module.exports = {
  init,
  getIo,
};
