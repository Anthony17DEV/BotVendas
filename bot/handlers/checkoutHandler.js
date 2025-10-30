const state = require('../state');
const apiService = require('../services/apiService');

function generateOrderSummary(checkoutState) {
    const total = checkoutState.cart.reduce((sum, item) => sum + (parseFloat(item.product.preco) * item.quantity), 0);
    let summary = `📋 *Resumo do Pedido:*\n\n`;
    summary += `👤 *Nome:* ${checkoutState.nome}\n`;
    if (checkoutState.cpf) summary += `🧾 *CPF:* ${checkoutState.cpf}\n\n`;

    if (checkoutState.tipoEntrega === 'entrega') {
        summary += `🚚 *Entrega em:*\n${checkoutState.endereco.rua}, ${checkoutState.endereco.numero} - ${checkoutState.endereco.bairro}, ${checkoutState.endereco.cidade}\n`;
        if(checkoutState.endereco.complemento && checkoutState.endereco.complemento.toLowerCase() !== 'nenhum') {
            summary += `Complemento: ${checkoutState.endereco.complemento}\n`;
        }
    } else {
        summary += `🏬 *Retirada na loja*\n`;
    }

    summary += `\n💳 *Pagamento:* ${checkoutState.pagamento}\n`;
    if (checkoutState.pagamento === 'dinheiro') {
        summary += `💵 *Troco para:* ${checkoutState.troco}\n`;
    }

    summary += `\n🛒 *Itens:*\n`;
    checkoutState.cart.forEach(item => {
        summary += ` - ${item.quantity}x ${item.product.nome}\n`;
    });
    
    summary += `\n💰 *Total a Pagar:* R$ ${total.toFixed(2)}`;
    return summary;
}

exports.startCheckout = async (client, from) => {
    const cart = state.carts[from];
    if (!cart || cart.length === 0) {
        await client.sendMessage(from, '🛒 Seu carrinho está vazio. Adicione produtos antes de finalizar.');
        return;
    }
    
    state.userStates[from] = 'checkout';
    state.checkoutStates[from] = {
        step: 'nome',
        cart,
        telefone: from.replace('@c.us', ''),
    };
    await client.sendMessage(from, '🧾 Para começar, por favor, informe seu *nome completo*.');
};

exports.handleCheckoutStep = async (client, message) => {
    const from = message.from;
    const text = message.body.trim();
    const checkoutState = state.checkoutStates[from];

    switch (checkoutState.step) {
        case 'nome':
            checkoutState.nome = text;
            checkoutState.step = 'cpf';
            await client.sendMessage(from, '🧾 Agora, informe seu *CPF* (opcional, digite "pular").');
            break;

        case 'cpf':
            checkoutState.cpf = text.toLowerCase() === 'pular' ? null : text;
            checkoutState.step = 'entrega_ou_retirada';
            await client.sendMessage(from, '📦 Deseja *entrega* ou *retirada*?');
            break;

        case 'entrega_ou_retirada':
            if (text.toLowerCase() === 'entrega') {
                checkoutState.tipoEntrega = 'entrega';
                checkoutState.step = 'cidade';
                await client.sendMessage(from, '🏙️ Informe sua *cidade* para entrega.');
            } else if (text.toLowerCase() === 'retirada') {
                checkoutState.tipoEntrega = 'retirada';
                checkoutState.endereco = {};
                checkoutState.step = 'pagamento';
                await client.sendMessage(from, '💳 Qual será a forma de pagamento? (*dinheiro*, *cartão* ou *pix*)');
            } else {
                await client.sendMessage(from, '❗ Opção inválida. Por favor, digite *entrega* ou *retirada*.');
            }
            break;
            
        case 'cidade':
            checkoutState.endereco = { cidade: text };
            checkoutState.step = 'bairro';
            await client.sendMessage(from, '🏘️ Agora, informe o *bairro*.');
            break;
        case 'bairro':
            checkoutState.endereco.bairro = text;
            checkoutState.step = 'rua';
            await client.sendMessage(from, '🚏 Informe o *nome da rua*.');
            break;
        case 'rua':
            checkoutState.endereco.rua = text;
            checkoutState.step = 'numero';
            await client.sendMessage(from, '🔢 Informe o *número* da residência.');
            break;
        case 'numero':
            checkoutState.endereco.numero = text;
            checkoutState.step = 'complemento';
            await client.sendMessage(from, '📌 Tem algum *complemento*? (Se não, digite "nenhum")');
            break;
        case 'complemento':
            checkoutState.endereco.complemento = text;
            checkoutState.step = 'pagamento';
            await client.sendMessage(from, '💳 Qual será a forma de pagamento? (*dinheiro*, *cartão* ou *pix*)');
            break;

        case 'pagamento':
            if (!['dinheiro', 'débito', 'credito', 'crédito', 'cartão', 'pix'].includes(text.toLowerCase())) {
                await client.sendMessage(from, '❗ Forma inválida. Escolha entre: *dinheiro*, *cartão* ou *pix*.');
                return;
            }
            checkoutState.pagamento = text;
            if (text.toLowerCase() === 'dinheiro') {
                checkoutState.step = 'troco';
                await client.sendMessage(from, '💵 Precisa de troco para quanto? (Se não, digite "não")');
            } else {
                checkoutState.troco = "Não se aplica";
                checkoutState.step = 'confirmar';
                const summary = generateOrderSummary(checkoutState);
                await client.sendMessage(from, summary + '\n\n✅ *Confirma o pedido?* (sim/não)');
            }
            break;
        
        case 'troco':
            checkoutState.troco = text;
            checkoutState.step = 'confirmar';
            const summary = generateOrderSummary(checkoutState);
            await client.sendMessage(from, summary + '\n\n✅ *Confirma o pedido?* (sim/não)');
            break;

        case 'confirmar':
            if (text.toLowerCase() === 'sim') {
                const total = checkoutState.cart.reduce((sum, i) => sum + (parseFloat(i.product.preco) * i.quantity), 0);
                const orderData = {
                    numeroLoja: state.storeData.whatsapp,
                    cliente: { nome: checkoutState.nome, telefone: checkoutState.telefone, cpf: checkoutState.cpf },
                    tipoEntrega: checkoutState.tipoEntrega,
                    endereco: checkoutState.endereco,
                    pagamento: checkoutState.pagamento,
                    troco: checkoutState.troco,
                    itens: checkoutState.cart.map(i => ({ id: i.product.id, nome: i.product.nome, preco: i.product.preco, quantidade: i.quantity })),
                    total: total
                };

                try {
                    await apiService.registerOrder(orderData);
                    await client.sendMessage(from, '📨 Pedido registrado com sucesso! Agradecemos a preferência. 🧾');
                } catch (error) {
                    await client.sendMessage(from, '❌ Ocorreu um erro ao registrar seu pedido. Por favor, tente novamente.');
                    console.error('Erro ao registrar pedido:', error);
                }

                delete state.userStates[from];
                delete state.checkoutStates[from];
                delete state.carts[from];
            } else {
                delete state.userStates[from];
                delete state.checkoutStates[from];
                await client.sendMessage(from, '❌ Pedido cancelado. Digite *oi* para recomeçar.');
            }
            break;
    }
};