const express = require('express');
const router = express.Router();
const detallesPedidosController = require('../controllers/detallesPedido.controller');


router.get('/', detallesPedidosController.index);
router.get('/:id', detallesPedidosController.getById);
router.post('/', detallesPedidosController.create);
router.delete('/:id', detallesPedidosController.delete);
router.put('/:id', detallesPedidosController.update);


module.exports = router;
