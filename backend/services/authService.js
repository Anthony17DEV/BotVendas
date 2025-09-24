const { centralDb, getTenantPool } = require('../config/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY; 

exports.loginUser = async (email, senha) => {
    const [empresas] = await centralDb.query(
        `SELECT id, nome, banco_dados, tipo_negocio FROM empresas WHERE email = ?`, [email]
    );

    if (empresas.length === 0) {
        throw new Error("Usuário ou senha inválidos.");
    }
    const empresa = empresas[0];
    const tenantPool = getTenantPool(empresa.banco_dados);

    const [usuarios] = await tenantPool.query(
        `SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE`, [email]
    );

    if (usuarios.length === 0) {
        throw new Error("Usuário ou senha inválidos.");
    }
    const usuario = usuarios[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error("Usuário ou senha inválidos.");
    }

    const payload = {
        userId: usuario.id,
        email: usuario.email,
        cargo: usuario.cargo,
        empresaId: empresa.id,
        banco_dados: empresa.banco_dados 
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' }); 

    return {
        message: "Login bem-sucedido!",
        token: token,
        usuario: {
            nome: usuario.nome,
            email: usuario.email,
            nome_empresa: empresa.nome
        }
    };
};