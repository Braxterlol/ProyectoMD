const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');


router.get('/', pedidosController.index);
router.get('/paginados', pedidosController.getPaginatedOrders);
router.get('/:id', pedidosController.getById);
router.post('/', pedidosController.create);
router.delete('/:id', pedidosController.delete);
router.put('/:id', pedidosController.update);

module.exports = router;
