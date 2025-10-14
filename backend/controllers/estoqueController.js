const estoqueService = require('../services/estoqueService');

const getDatabaseName = (req) => {
    return req.user?.banco_dados || req.query.banco_dados || req.body.banco_dados;
};

exports.createItem = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });
        
        const { banco_dados: dbName, ...itemData } = req.body;

        const item = await estoqueService.createItem(banco_dados, itemData, req.file);
        res.status(201).json({ success: true, message: 'Item cadastrado com sucesso!', data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllItens = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });
        
        const result = await estoqueService.getAllItens(banco_dados);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        const { id } = req.params;
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });

        const item = await estoqueService.getItemById(banco_dados, id);
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        const { id } = req.params;
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });

        const { banco_dados: dbName, ...itemData } = req.body;
        
        const item = await estoqueService.updateItem(banco_dados, id, itemData, req.file);
        res.status(200).json({ success: true, message: 'Item atualizado com sucesso!', data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        const { id } = req.params;
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });

        await estoqueService.deleteItem(banco_dados, id);
        res.status(200).json({ success: true, message: 'Item deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getIndicadores = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });

        const indicadores = await estoqueService.getIndicadores(banco_dados);
        res.status(200).json({ success: true, data: indicadores });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCamposDoEstoque = async (req, res) => {
    try {
        const banco_dados = getDatabaseName(req);
        if (!banco_dados) return res.status(400).json({ success: false, message: "Banco de dados não informado." });

        const campos = await estoqueService.getCamposDoEstoque(banco_dados);
        res.status(200).json({ success: true, data: campos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};