const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const upload = require('../config/multerConfig');

router.get('/indicadores', estoqueController.getIndicadores);
router.get('/campos', estoqueController.getCamposDoEstoque);

router.get('/', estoqueController.getAllItens);
router.post('/', upload.single('imagem'), estoqueController.createItem); 
router.get('/:id', estoqueController.getItemById);
router.put('/:id', upload.single('imagem'), estoqueController.updateItem); 
router.delete('/:id', estoqueController.deleteItem);

module.exports = router;