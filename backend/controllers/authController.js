const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ success: false, message: "Email e senha são obrigatórios." });
        }

        const result = await authService.loginUser(email, senha);

        res.status(200).json({ success: true, ...result });

    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};