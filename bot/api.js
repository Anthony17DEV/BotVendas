const express = require('express');
const bodyParser = require('body-parser');
const app = express();

exports.initializeApi = (client) => {
    app.use(bodyParser.json());

    app.post('/api/notificar-cliente', async (req, res) => {
        if (!client) {
            return res.status(503).json({ error: 'Bot não está pronto.' });
        }
        
        const { telefone, mensagem } = req.body;
        if (!telefone || !mensagem) {
            return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios.' });
        }

        const formattedNumber = `${telefone}@c.us`;

        try {
            await client.sendMessage(formattedNumber, mensagem);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('❌ Erro ao enviar mensagem via API:', err);
            return res.status(500).json({ error: 'Falha ao enviar mensagem.' });
        }
    });

    const PORT = process.env.BOT_API_PORT || 5001;
    app.listen(PORT, () => {
        console.log(`📡 API do bot escutando em http://localhost:${PORT}`);
    });
};