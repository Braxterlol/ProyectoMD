const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');


router.get('/', productosController.index);
router.get('/:id', productosController.getById);
router.post('/', productosController.create);
router.delete('/:id', productosController.delete);
router.patch('/:id', productosController.update);

module.exports = router;
