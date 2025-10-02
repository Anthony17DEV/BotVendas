const state = require('../state');
const apiService = require('../services/apiService');
const cartHandler = require('./cartHandler');

const ITEMS_PER_PAGE = 5;

function formatCatalogMessage(products, page) {
    let response = `🛍️ *Catálogo de Produtos (página ${page}):*\n\n`;
    products.forEach((p, i) => {
        const preco = parseFloat(p.preco || 0).toFixed(2);
        response += `*${i + 1}.* ${p.nome}\n💰 *Preço:* R$ ${preco}\n📦 *Estoque:* ${p.quantidade ?? 'N/A'}\n\n`;
    });
    response += '_Digite *quero 1*, *quero 2*, etc. para adicionar ao carrinho._\n';
    response += '_Digite *mais* para ver a próxima página._\n';
    response += '_Digite *voltar* para sair do catálogo._';
    return response;
}

exports.showCatalog = async (client, from) => {
    try {
        const stock = await apiService.getStoreStock(state.storeData.data.id);
        if (!stock || stock.length === 0) {
            await client.sendText(from, '📦 Nenhum produto cadastrado no momento.');
            return;
        }
        
        state.userStates[from] = 'catalog';
        state.catalogStates[from] = { page: 1, products: stock, filtered: stock };
        
        const productsToShow = stock.slice(0, ITEMS_PER_PAGE);
        const response = formatCatalogMessage(productsToShow, 1);
        await client.sendText(from, response);
    } catch (error) {
        console.error('Erro ao buscar catálogo:', error);
        await client.sendText(from, '❌ Ocorreu um erro ao buscar os produtos.');
    }
};

exports.handleCatalogInteraction = async (client, message) => {
    const from = message.from;
    const text = message.body.toLowerCase().trim();
    const catalogState = state.catalogStates[from];

    if (text === 'mais') {
        const nextPage = catalogState.page + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const productsToShow = catalogState.filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        if (productsToShow.length === 0) {
            await client.sendText(from, '🚫 Não há mais produtos para mostrar.');
            return;
        }

        catalogState.page = nextPage;
        const response = formatCatalogMessage(productsToShow, nextPage);
        await client.sendText(from, response);
        return;
    }

    if (text === 'voltar') {
        delete state.userStates[from];
        delete state.catalogStates[from];
        await client.sendText(from, '↩️ Saindo do catálogo. Digite *oi* para ver o menu.');
        return;
    }

    if (text.startsWith('quero ') || text.startsWith('adicionar ')) {
        await cartHandler.handleAddToCart(client, message);
        return;
    }

    const filteredProducts = catalogState.products.filter(p => 
        Object.values(p).some(val => 
            String(val).toLowerCase().includes(text)
        )
    );

    if (filteredProducts.length === 0) {
        await client.sendText(from, `🔍 Nenhum produto encontrado com o termo: "${text}".`);
        return;
    }
    
    catalogState.page = 1;
    catalogState.filtered = filteredProducts;
    
    const productsToShow = filteredProducts.slice(0, ITEMS_PER_PAGE);
    const response = formatCatalogMessage(productsToShow, 1);
    await client.sendText(from, `🔎 Resultados para "${text}":\n\n` + response);
};