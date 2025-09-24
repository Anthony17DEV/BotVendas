const dashboardService = require("../services/dashboardService");

exports.getDashboardSummary = async (req, res) => {
    try {
        // IMPORTANTE: Em um sistema real, o nome do banco viria de um usuário
        // já autenticado (ex: de um token JWT), e não de uma query.
        // const { banco_dados } = req.user; // <-- O jeito correto no futuro
        const { banco_dados } = req.query; // Mantendo por enquanto para testar

        if (!banco_dados) {
            return res.status(400).json({
                success: false,
                message: "Identificação da empresa não encontrada na requisição."
            });
        }

        const summary = await dashboardService.generateSummary(banco_dados);

        return res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error("Erro no controller do dashboard:", error.message);
        return res.status(500).json({
            success: false,
            message: "Erro interno no servidor ao processar o resumo."
        });
    }
};