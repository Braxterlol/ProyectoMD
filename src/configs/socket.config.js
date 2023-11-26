const socketIo = require('socket.io');

let io;

function init(server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Ejemplo: Manejar un evento personalizado 'actualizar-producto'
    socket.on('actualizar-producto', (data) => {
      console.log('Evento "actualizar-producto" recibido:', data);

      // Aquí puedes realizar la lógica necesaria, por ejemplo, emitir a otros clientes
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
