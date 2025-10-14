const recoveryService = require('../services/recoveryService');

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'O email é obrigatório.' });
        }
        await recoveryService.requestReset(email);
        res.status(200).json({ success: true, message: 'Se o email estiver cadastrado, um link de redefinição foi enviado.' });
    } catch (error) {
        console.error("Erro ao solicitar redefinição:", error);
        res.status(200).json({ success: true, message: 'Se o email estiver cadastrado, um link de redefinição foi enviado.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;
        if (!token || !novaSenha) {
            return res.status(400).json({ success: false, message: 'Token e nova senha são obrigatórios.' });
        }
        await recoveryService.resetPassword(token, novaSenha);
        res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};