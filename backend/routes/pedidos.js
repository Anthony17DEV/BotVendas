const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { centralDb } = require('../config/db');

router.post('/pedidos', async (req, res) => {
  try {
    console.log('📥 Requisição recebida em /api/pedidos');
    console.log('Dados recebidos:', req.body);

    const {
      cliente,
      tipoEntrega,
      endereco,
      pagamento,
      troco,
      itens,
      total,
      numeroLoja // <- chave para buscar o banco correto
    } = req.body;

    console.log('🔍 Buscando banco para número:', JSON.stringify(numeroLoja)); 

    const numeroFormatado = String(numeroLoja).trim();

    if (!numeroLoja || !cliente || !itens || itens.length === 0 || !total) {
      return res.status(400).json({ mensagem: 'Dados incompletos.' });
    }

    // 🔍 Buscar nome do banco no banco central
    const [empresas] = await centralDb.query(
      'SELECT banco_dados FROM empresas WHERE TRIM(whatsapp) = ? LIMIT 1',
      [numeroFormatado]
    );

    if (!empresas.length) {
      return res.status(404).json({ mensagem: 'Empresa não encontrada com esse número.' });
    }

    const nomeBanco = empresas[0].banco_dados;

    // 🔌 Conectar ao banco da empresa
    const empresaDb = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: nomeBanco
    });

    // Serializar os itens como texto (JSON)
    const itensJSON = JSON.stringify(itens);

    // 📝 Inserir pedido
    const [resultado] = await empresaDb.query(
      `INSERT INTO pedidos (
        nome_cliente, cpf_cliente, telefone_cliente,
        tipo_entrega, cidade, bairro, rua, numero, complemento,
        pagamento, troco, itens, total, status, data_pedido
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cliente.nome,
        cliente.cpf,
        cliente.telefone,
        tipoEntrega,
        endereco?.cidade || '',
        endereco?.bairro || '',
        endereco?.rua || '',
        endereco?.numero || '',
        endereco?.complemento || '',
        pagamento,
        troco,
        itensJSON,
        total,
        'Aguardando Aprovação'
      ]
    );

    await empresaDb.end();

    res.status(201).json({
      mensagem: 'Pedido registrado com sucesso!',
      pedidoId: resultado.insertId
    });

  } catch (err) {
    console.error('❌ Erro ao salvar pedido:', err);
    res.status(500).json({
    mensagem: 'Erro interno ao registrar pedido.',
    erro: err.message || err
  });

  }
});

module.exports = router;
