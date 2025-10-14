require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { initializeApi } = require('./api');
const { handleMessage } = require('./messageHandler');

console.log('Iniciando o bot com whatsapp-web.js...');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-vendas" 
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', (qr) => {
    console.log('QR Code Recebido! Escaneie com seu celular.');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('✅ Autenticado com sucesso!');
});

client.on('ready', () => {
    console.log('✅ Bot está pronto e conectado!');
    initializeApi(client);
});

client.on('message', async (message) => {
    await handleMessage(client, message);
});

client.initialize();