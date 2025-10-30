const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { centralDb, getTenantPool } = require('../config/db');
const schemas = require('../config/tableSchemas');
require('dotenv').config();

const createDatabaseIfNotExists = async (dbName) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    } finally {
        if (connection) await connection.end();
    }
};

exports.createEmpresa = async (empresaData) => {
    const connection = await centralDb.getConnection();
    await connection.beginTransaction();
    const banco_dados = `empresa_${empresaData.cnpj_cpf.replace(/\D/g, '')}`;

    try {
        const {
            nome, email, telefone, proprietario, tipo_negocio, localizacao, cnpj_cpf,
            instagram, whatsapp, site, descricao, horario_abertura, horario_fechamento, formas_pagamento,
            plano_ativo, status_empresa, observacoes
        } = empresaData;

        const horario_funcionamento = `${horario_abertura} - ${horario_fechamento}`;

        const insertQuery = `
            INSERT INTO empresas (
                nome, email, telefone, proprietario, tipo_negocio, localizacao, banco_dados, cnpj_cpf,
                instagram, whatsapp, site, descricao, horario_funcionamento, formas_pagamento,
                plano_ativo, status_empresa, observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertQuery, [
            nome, email, telefone, proprietario, tipo_negocio, localizacao, banco_dados, cnpj_cpf,
            instagram, whatsapp, site, descricao, horario_funcionamento, JSON.stringify(formas_pagamento),
            plano_ativo, status_empresa, observacoes
        ]);

        await createDatabaseIfNotExists(banco_dados);
        const tenantPool = getTenantPool(banco_dados);

        const estoqueSchema = schemas.estoque[tipo_negocio] || schemas.estoque.padrao;
        await tenantPool.query(schemas.usuarios);
        await tenantPool.query(schemas.pedidos);
        await tenantPool.query(schemas.tokens_recuperacao); 
        await tenantPool.query(estoqueSchema);

        const senhaInicial = empresaData.senha || 'mudar123';
        const saltRounds = 10;
        const senhaHasheada = await bcrypt.hash(senhaInicial, saltRounds);

        await tenantPool.query(
            `INSERT INTO usuarios (email, senha, nome, cargo) VALUES (?, ?, ?, ?)`,
            [email, senhaHasheada, proprietario, 'admin']
        );

        await connection.commit();
        return { message: 'Empresa criada com sucesso', banco_dados };

    } catch (error) {
        await connection.rollback();
        console.error("❌ OCORREU UM ERRO! Rollback executado.", error);
        throw new Error("Falha ao criar a empresa. A operação foi revertida.");
    } finally {
        connection.release();
    }
};

exports.getAllEmpresas = async () => {
    const [rows] = await centralDb.query('SELECT id, nome, email, banco_dados, status_empresa FROM empresas');
    return rows;
};

exports.getEmpresaByWhatsapp = async (numeroWhatsapp) => {
    const sufixoNumero = numeroWhatsapp.slice(-9); 
    
    const [rows] = await centralDb.query(
        'SELECT * FROM empresas WHERE whatsapp LIKE ? AND status_empresa = "ativo" LIMIT 1',
        [`%${sufixoNumero}`]
    );

    if (rows.length === 0) {
        throw new Error(`Nenhuma empresa ativa encontrada com um número de WhatsApp terminando em '${sufixoNumero}'. Verifique o cadastro.`);
    }
    return rows[0];
};

exports.getEstoqueByEmpresaId = async (idEmpresa) => {
    const [empresaRows] = await centralDb.query('SELECT banco_dados FROM empresas WHERE id = ?', [idEmpresa]);
    
    if (!empresaRows || empresaRows.length === 0) {
        throw new Error('Empresa não encontrada no banco central.');
    }
    
    const nomeBanco = empresaRows[0].banco_dados;

    const tenantPool = getTenantPool(nomeBanco);

    const [produtos] = await tenantPool.query('SELECT * FROM estoque');
    
    return produtos; 
};