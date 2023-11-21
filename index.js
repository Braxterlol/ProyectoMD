require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();
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

app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});