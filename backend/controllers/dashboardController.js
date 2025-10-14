const dashboardService = require("../services/dashboardService");

exports.getDashboardSummary = async (req, res) => {

    try {
        const { banco_dados } = req.user;

        if (!banco_dados) {
            throw new Error("banco_dados não encontrado no token do usuário.");
        }
        
        const summary = await dashboardService.generateSummary(banco_dados);

        return res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error("❌ Erro no controller do dashboard:", error.message);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor ao processar o resumo."
        });
    }
};