const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.index);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.delete('/:id', usuariosController.delete);
router.patch('/:id', usuariosController.update);

module.exports = router;