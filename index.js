require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 
const app = express();
const server = http.createServer(app);  
const PORT = process.env.PORT;

//autorizar cors
app.use(cors());
// middlewares
app.use(express.json());

// rutas
const usuariosRouter = require('./src/routes/usuarios.route');
const pedidosRouter = require('./src/routes/pedidos.routes');
const productosRouter = require('./src/routes/productos.routes');
const detallePedidoRouter = require('./src/routes/detallePedidos.routes');


app.use('/usuarios', usuariosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/productos', productosRouter);
app.use('/detallePedidos', detallePedidoRouter);



const socketConfig = require('./src/configs/socket.config');  
socketConfig.init(server);

// Manejo de eventos de Socket.io
socketConfig.getIo().on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`API escuchando en el puerto ${PORT}`);
});
