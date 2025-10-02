const state = require('../state');
const templates = require('../templates');
const catalogHandler = require('./catalogHandler');
const cartHandler = require('./cartHandler');
const checkoutHandler = require('./checkoutHandler');

exports.handleCommand = async (client, message) => {
    const from = message.from;
    const text = message.body.toLowerCase().trim();

    if (text === 'oi' || text === 'olá' || text === 'voltar ao menu') {
        state.userStates[from] = null; 
        await client.sendText(from, templates.welcomeMessage(state.storeData.data.nome));
        return;
    }
    if (text === '1') {
        await catalogHandler.showCatalog(client, from);
        return;
    }
    if (text === '2') {
        await cartHandler.showCart(client, from);
        return;
    }
    if (text === '3') {
        await client.sendText(from, '💬 Um de nossos atendentes humanos irá te responder em breve. Por favor, aguarde ou envie sua dúvida!');
        return;
    }
    if (text === '4') {
        delete state.userStates[from];
        delete state.catalogStates[from];
        delete state.carts[from];
        delete state.checkoutStates[from];
        delete state.addToCartQueue[from];
        await client.sendText(from, '❌ Atendimento cancelado. Se quiser voltar, digite *oi*.');
        return;
    }
    if (text === 'finalizar') {
        await checkoutHandler.startCheckout(client, from);
        return;
    }

    if (text.startsWith('remover ')) {
        await cartHandler.removeItem(client, message);
        return;
    }
    if (text.startsWith('quero ') || text.startsWith('adicionar ')) {
        await client.sendText(from, '⚠️ Para adicionar um item, primeiro veja o catálogo digitando "1".');
        return;
    }

    await client.sendText(from, '❌ Comando não reconhecido. Por favor, digite *oi* para ver as opções.');
};