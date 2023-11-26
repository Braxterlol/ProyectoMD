const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');


router.get('/tipo/:tipo', productosController.getByTipo);
router.get('/', productosController.index);
router.get('/:id', productosController.getById);
router.post('/', productosController.create);
router.delete('/:id', productosController.delete);
router.put('/:id', productosController.update);
router.put('/:id/estatus', productosController.updateEstatusById);

module.exports = router;
