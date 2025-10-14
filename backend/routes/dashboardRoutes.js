const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
// const authMiddleware = require("../middleware/authMiddleware"); 

/**
 * @route GET /api/dashboard/resumo
 * @description Retorna um resumo dos principais indicadores do dashboard.
 * @access Private - Apenas para usuários autenticados.
 *
 * Futuramente, esta rota será protegida por um middleware de autenticação.
 */
router.get("/resumo", dashboardController.getDashboardSummary);

module.exports = router;