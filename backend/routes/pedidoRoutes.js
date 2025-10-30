const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', pedidoController.createPedido);

router.use(authMiddleware);

router.get('/', pedidoController.getAllPedidos);

router.patch('/:id/status', pedidoController.updatePedidoStatus);

module.exports = router;