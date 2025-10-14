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
        console.log(`✅ Banco de dados '${dbName}' verificado/criado.`);
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
            instagram, whatsapp, site, descricao, horario_funcionamento, formas_pagamento,
            plano_ativo, status_empresa, observacoes
        } = empresaData;

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
        console.log(`🔹 Empresa '${nome}' inserida na tabela central (em transação).`);

        await createDatabaseIfNotExists(banco_dados);
        const tenantPool = getTenantPool(banco_dados);

        const estoqueSchema = schemas.estoque[tipo_negocio] || schemas.estoque.padrao;
        await tenantPool.query(schemas.usuarios);
        await tenantPool.query(schemas.pedidos);
        await tenantPool.query(estoqueSchema);
        console.log(`✅ Tabelas criadas no banco '${banco_dados}'.`);

        const senhaInicial = empresaData.senha || 'mudar123'; 
        const saltRounds = 10; 
        const senhaHasheada = await bcrypt.hash(senhaInicial, saltRounds);
        console.log(`🔒 Senha para o usuário '${email}' criptografada.`);

        await tenantPool.query(
            `INSERT INTO usuarios (email, senha, nome, cargo) VALUES (?, ?, ?, ?)`,
            [email, senhaHasheada, proprietario, 'admin'] 
        );
        console.log(`👤 Usuário admin criado para a empresa.`);

        await connection.commit();
        console.log(`🎉 Transação concluída! Empresa '${nome}' criada com sucesso.`);

        return { message: 'Empresa criada com sucesso', banco_dados };

    } catch (error) {
        await connection.rollback();
        console.error("❌ OCORREU UM ERRO! Rollback executado.", error);
        
        throw new Error("Falha ao criar a empresa. A operação foi revertida para garantir a consistência dos dados.");
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