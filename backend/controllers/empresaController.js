const empresaService = require('../services/empresaService');

exports.createEmpresa = async (req, res) => {
    try {
        const requiredFields = ['nome', 'email', 'cnpj_cpf', 'proprietario'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `O campo '${field}' é obrigatório.` });
            }
        }
        const result = await empresaService.createEmpresa(req.body);
        res.status(201).json({ success: true, message: "Empresa criada e configurada com sucesso!", data: result });
    } catch (error) {
        console.error("❌ ERRO NO CONTROLLER AO CRIAR EMPRESA:", error);
        res.status(500).json({ success: false, message: error.message || "Erro interno no servidor." });
    }
};

exports.getAllEmpresas = async (req, res) => {
    try {
        const empresas = await empresaService.getAllEmpresas();
        res.status(200).json({ success: true, data: empresas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEmpresaByWhatsapp = async (req, res) => {
    try {
        const { numero } = req.params;
        const empresa = await empresaService.getEmpresaByWhatsapp(numero);
        res.status(200).json({ success: true, data: empresa });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.getEstoqueByEmpresaId = async (req, res) => {
    try {
        const { idEmpresa } = req.params;
        const estoque = await empresaService.getEstoqueByEmpresaId(idEmpresa);
        res.status(200).json({ success: true, data: estoque });
    } catch (error) {
        console.error("❌ ERRO NO CONTROLLER AO BUSCAR ESTOQUE:", error);
        res.status(500).json({ success: false, message: error.message || "Erro interno no servidor." });
    }
};