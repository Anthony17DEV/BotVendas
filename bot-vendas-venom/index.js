require('dotenv').config();
const venom = require('venom-bot');
const { initializeApi } = require('./api');
const { handleMessage } = require('./messageHandler');

async function main() {
    console.log('Iniciando o bot...');
    try {
        const client = await venom.create({
            session: 'bot-vendas',
            multidevice: true,
            headless: 'new' 
        });

        console.log('✅ Cliente Venom criado.');
        
        await handleMessage(client);
        
        initializeApi(client);

    } catch (error) {
        console.error('❌ Erro fatal ao iniciar o bot:', error);
    }
}

main();