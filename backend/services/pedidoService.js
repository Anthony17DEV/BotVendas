const { centralDb, getTenantPool } = require('../config/db');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const crypto = require('crypto');

exports.createPedido = async (pedidoData) => {
    const { cliente, itens, total, numeroLoja, ...resto } = pedidoData;

    const [empresas] = await centralDb.query('SELECT banco_dados FROM empresas WHERE TRIM(whatsapp) = ? LIMIT 1', [String(numeroLoja).trim()]);
    if (empresas.length === 0) {
        throw new Error('Empresa não encontrada com esse número.');
    }
    const nomeBanco = empresas[0].banco_dados;
    const pool = getTenantPool(nomeBanco);

    const codigo_pedido = `#${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const sql = `INSERT INTO pedidos (codigo_pedido, nome_cliente, telefone_cliente, itens, total, tipo_entrega, endereco_entrega, forma_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [resultado] = await pool.query(sql, [
        codigo_pedido,
        cliente.nome,
        cliente.telefone,
        JSON.stringify(itens),
        total,
        resto.tipoEntrega,
        JSON.stringify(resto.endereco),
        resto.pagamento
    ]);

    return { pedidoId: resultado.insertId, codigo_pedido };
};

exports.getAllPedidos = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [pedidos] = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
    return pedidos;
};

exports.updatePedidoStatus = async (banco_dados, pedidoId, novoStatus, motivo) => {
    const pool = getTenantPool(banco_dados);
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [[pedido]] = await connection.query('SELECT * FROM pedidos WHERE id = ? FOR UPDATE', [pedidoId]);
        if (!pedido) throw new Error('Pedido não encontrado.');

        const statusAnterior = pedido.status;
        const itens = JSON.parse(pedido.itens || '[]');

        await connection.query('UPDATE pedidos SET status = ?, motivo_cancelamento = ? WHERE id = ?', [novoStatus, motivo || null, pedidoId]);

        if (novoStatus === 'Confirmado' && statusAnterior === 'Pendente') {
            for (const item of itens) {
                const quantidadePedido = item.quantidade || 1;
                await connection.query('UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?', [quantidadePedido, item.id]);
            }
        } else if (novoStatus === 'Cancelado' && (statusAnterior === 'Confirmado' || statusAnterior === 'Em Preparo')) {
            for (const item of itens) {
                const quantidadePedido = item.quantidade || 1;
                await connection.query('UPDATE estoque SET quantidade = quantidade + ? WHERE id = ?', [quantidadePedido, item.id]);
            }
        }
        
        await connection.commit();

        if (novoStatus === 'Confirmado') {
            try {
                await fetch(process.env.BOT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        telefone: pedido.telefone_cliente,
                        mensagem: `Olá, ${pedido.nome_cliente}! Seu pedido ${pedido.codigo_pedido} foi confirmado e já está em preparo. 🎉`
                    })
                });
            } catch (err) {
                console.error('⚠️ Erro ao notificar cliente via bot (não afetou o pedido):', err.message);
            }
        }
    } catch (error) {
        await connection.rollback();
        console.error("❌ Erro na transação, rollback executado:", error);
        throw new Error("Falha ao atualizar o status do pedido.");
    } finally {
        connection.release();
    }
};