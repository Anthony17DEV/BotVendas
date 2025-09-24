const pedidoService = require('../services/pedidoService');

exports.createPedido = async (req, res) => {
    try {
        const pedido = await pedidoService.createPedido(req.body);
        res.status(201).json({ success: true, message: 'Pedido registrado com sucesso!', data: pedido });
    } catch (error) {
        console.error('❌ Erro no controller ao criar pedido:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllPedidos = async (req, res) => {
    try {
        const { banco_dados } = req.user;

        if (!banco_dados) {
            return res.status(400).json({ success: false, message: 'Identificação da empresa não encontrada.' });
        }
        
        const pedidos = await pedidoService.getAllPedidos(banco_dados);
        res.status(200).json({ success: true, data: pedidos });
    } catch (error) {
        console.error('❌ Erro no controller ao listar pedidos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePedidoStatus = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const { id } = req.params;
        const { status, motivo_cancelamento } = req.body;

        if (!banco_dados || !id || !status) {
            return res.status(400).json({ success: false, message: 'Dados obrigatórios faltando.' });
        }
        
        await pedidoService.updatePedidoStatus(banco_dados, id, status, motivo_cancelamento);
        res.status(200).json({ success: true, message: 'Status do pedido atualizado com sucesso.' });
    } catch (error) {
        console.error('❌ Erro no controller ao atualizar status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};