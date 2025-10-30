const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const empresaRoutes = require('./routes/empresaRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Carregando rotas da API...');
app.use('/api/auth', authRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/estoque', authMiddleware, estoqueRoutes);
app.use('/api/empresas', empresaRoutes);
console.log('👍 Todas as rotas foram carregadas com sucesso!');

app.get('/api', (req, res) => {
    res.json({ message: "API do BotVendas está no ar! ✨", version: "1.0.1" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});