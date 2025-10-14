const { centralDb, getTenantPool } = require('../config/db');
const transporter = require('../config/mailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.requestReset = async (email) => {
    const [empresas] = await centralDb.query(`SELECT banco_dados FROM empresas WHERE email = ?`, [email]);
    if (empresas.length === 0) {
        console.log(`Tentativa de recuperação para email não cadastrado: ${email}`);
        return;
    }
    const banco_dados = empresas[0].banco_dados;
    const pool = getTenantPool(banco_dados);

    const token = crypto.randomBytes(32).toString('hex');
    const expiracao = new Date(Date.now() + 3600000);

    await pool.query(
        `INSERT INTO tokens_recuperacao (email, token, expiracao) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE token = VALUES(token), expiracao = VALUES(expiracao)`,
        [email, token, expiracao]
    );

    const resetLink = `${process.env.FRONTEND_URL}/definir-senha?token=${token}`;
    await transporter.sendMail({
        from: `Suporte BotVendas <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Redefinição de Senha - BotVendas',
        html: `<p>Olá,</p><p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Este link expira em 1 hora.</p>`,
    });
};

exports.resetPassword = async (token, novaSenha) => {
    let banco_dados;
    let email;

    const [empresas] = await centralDb.query(`SELECT banco_dados FROM empresas`);
    for (const empresa of empresas) {
        const pool = getTenantPool(empresa.banco_dados);
        const [tokens] = await pool.query(`SELECT email FROM tokens_recuperacao WHERE token = ? AND expiracao > NOW()`, [token]);
        if (tokens.length > 0) {
            banco_dados = empresa.banco_dados;
            email = tokens[0].email;
            break;
        }
    }

    if (!banco_dados) {
        throw new Error("Token inválido ou expirado.");
    }
    
    const saltRounds = 10;
    const senhaHasheada = await bcrypt.hash(novaSenha, saltRounds);

    const pool = getTenantPool(banco_dados);
    await pool.query(`UPDATE usuarios SET senha = ? WHERE email = ?`, [senhaHasheada, email]);
    await pool.query(`DELETE FROM tokens_recuperacao WHERE token = ?`, [token]);
};