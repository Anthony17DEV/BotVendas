const { getTenantPool } = require('../config/db');

/**
 * @param {string} 
 * @returns {Promise<object>} 
 */
exports.generateSummary = async (databaseName) => {
    try {
        const pool = getTenantPool(databaseName);

        const [estoque] = await pool.query("SELECT nome, preco, quantidade FROM estoque");

        const totalProdutos = estoque.length;
        const totalQuantidade = estoque.reduce((acc, item) => acc + (item.quantidade || 0), 0);
        const produtosEstoqueBaixo = estoque.filter(item => (item.quantidade || 0) < 5).length;

        const produtosMaisVendidos = estoque.slice(0, 3).map(item => item.nome);

        return {
            totalProdutos,
            totalQuantidade,
            produtosEstoqueBaixo,
            produtosMaisVendidos
        };

    } catch (error) {
        console.error(`Erro ao gerar resumo para o banco ${databaseName}:`, error);
        throw new Error("Falha ao buscar dados do estoque.");
    }
};