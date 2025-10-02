const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getAllPedidos);

router.patch('/:id/status', pedidoController.updatePedidoStatus);

module.exports = router;