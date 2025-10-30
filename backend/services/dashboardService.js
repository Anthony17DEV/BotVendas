const { getTenantPool } = require('../config/db');

exports.generateSummary = async (databaseName) => {
    try {
        const pool = getTenantPool(databaseName);

        const [estoque] = await pool.query("SELECT preco, quantidade FROM estoque WHERE quantidade IS NOT NULL");
        
        const [pedidos] = await pool.query(
            "SELECT COUNT(id) as total FROM pedidos WHERE DATE(data_pedido) = CURDATE()"
        );

        const totalProdutos = estoque.length;
        const totalQuantidade = estoque.reduce((acc, item) => acc + Number(item.quantidade), 0);
        
        const pedidosHoje = pedidos[0].total; 

        return {
            totalProdutos,
            totalQuantidade,
            pedidosHoje 
        };

    } catch (error) {
        console.error(`Erro ao gerar resumo para o banco ${databaseName}:`, error);
        throw new Error("Falha ao buscar dados do dashboard.");
    }
};