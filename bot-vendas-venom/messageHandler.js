const state = require('./state');
const apiService = require('./services/apiService');
const commandHandler = require('./handlers/commandHandler');
const catalogHandler = require('./handlers/catalogHandler');
const cartHandler = require('./handlers/cartHandler');
const checkoutHandler = require('./handlers/checkoutHandler');

exports.handleMessage = async (client) => {
    console.log('👂 Escutando por novas mensagens...');

    try {
        const host = await client.getHostDevice();
        const botNumber = host?.id?.user;
        if (!botNumber) throw new Error('Número do bot não encontrado.');
        
        state.storeData = await apiService.getStoreDataByNumber(botNumber);
        console.log(`🏪 Bot operando para a loja: ${state.storeData.data.nome}`);
    } catch (err) {
        console.error('❌ Erro crítico ao buscar dados da loja na inicialização:', err);
        return; 
    }
    
    client.onMessage(async (message) => {
        if (!message.body || message.isGroupMsg) return;

        const from = message.from;
        const text = message.body.toLowerCase().trim();
        const userState = state.userStates[from];

        try {
            if (userState === 'adding_to_cart') {
                await cartHandler.handleQuantityResponse(client, message);
            } else if (userState === 'checkout') {
                await checkoutHandler.handleCheckoutStep(client, message);
            } else if (userState === 'catalog') {
                await catalogHandler.handleCatalogInteraction(client, message);
            } else {
                await commandHandler.handleCommand(client, message);
            }
        } catch (error) {
            console.error(`❌ Erro ao processar mensagem de ${from}:`, error);
            await client.sendText(from, '🤖 Ocorreu um erro inesperado. Por favor, tente novamente. Se o erro persistir, digite "4" para cancelar e comece de novo com "oi".');
        }
    });
};