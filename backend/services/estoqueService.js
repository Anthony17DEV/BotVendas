const { getTenantPool } = require('../config/db');

exports.getCamposDoEstoque = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [columns] = await pool.query("SHOW COLUMNS FROM estoque");
    
    const camposFiltrados = columns
        .filter(col => !["id", "criado_em", "imagem_url"].includes(col.Field))
        .map(col => ({
            nome: col.Field,
            tipo: col.Type
        }));
    return camposFiltrados;
};

exports.createItem = async (banco_dados, itemData, file) => {
    const pool = getTenantPool(banco_dados);
    
    const dataToInsert = { ...itemData };
    if (file) {
        dataToInsert.imagem_url = file.filename;
    }

    const campos = Object.keys(dataToInsert);
    const valores = Object.values(dataToInsert);
    const placeholders = campos.map(() => '?').join(', ');

    const sql = `INSERT INTO estoque (${campos.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await pool.query(sql, valores);
    return { id: result.insertId, ...dataToInsert };
};

exports.getAllItens = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [dados] = await pool.query("SELECT * FROM estoque ORDER BY id DESC");
    const [columns] = await pool.query("SHOW COLUMNS FROM estoque");
    const colunas = columns.map(c => c.Field);
    return { colunas, dados };
};

exports.getItemById = async (banco_dados, id) => {
    const pool = getTenantPool(banco_dados);
    const [rows] = await pool.query("SELECT * FROM estoque WHERE id = ?", [id]);
    if (rows.length === 0) {
        throw new Error("Item não encontrado.");
    }
    return rows[0];
};

exports.updateItem = async (banco_dados, id, itemData, file) => {
    const pool = getTenantPool(banco_dados);
    const dataToUpdate = { ...itemData };
    
    if (file) {
        dataToUpdate.imagem_url = file.filename;
    }

    const campos = Object.keys(dataToUpdate);
    const valores = Object.values(dataToUpdate);
    
    const updates = campos.map(c => `\`${c}\` = ?`).join(", ");
    const sql = `UPDATE estoque SET ${updates} WHERE id = ?`;

    await pool.query(sql, [...valores, id]);
    return { id, ...dataToUpdate };
};

exports.deleteItem = async (banco_dados, id) => {
    const pool = getTenantPool(banco_dados);
    const [result] = await pool.query("DELETE FROM estoque WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

exports.getIndicadores = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [dados] = await pool.query("SELECT preco, quantidade FROM estoque WHERE quantidade IS NOT NULL");
    
    const totalProdutos = dados.length;
    const totalQuantidade = dados.reduce((acc, item) => acc + Number(item.quantidade), 0);
    const totalValor = dados.reduce((acc, item) => acc + (Number(item.preco) * Number(item.quantidade)), 0);

    return { totalProdutos, totalQuantidade, totalValor };
};