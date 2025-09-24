const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
// const { isAdmin } = require('../middleware/authMiddleware'); 

router.get('/por-numero-bot/:numero', empresaController.getEmpresaByWhatsapp);

router.get('/estoque/:idEmpresa', empresaController.getEstoqueByEmpresaId);

router.get('/', empresaController.getAllEmpresas);
router.post('/', empresaController.createEmpresa);

module.exports = router;