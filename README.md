# 🧠 Bot Vendas – Automação de WhatsApp para Lojas

## 📌 Visão Geral
**Bot Vendas** é um sistema **SaaS** voltado para empresas que desejam automatizar o atendimento e vendas pelo **WhatsApp**. Através dele, as empresas conseguem cadastrar seu estoque, configurar o bot de atendimento e acompanhar os pedidos diretamente de um **painel gerencial intuitivo**.

---

## 🏗 Estrutura do Projeto
O sistema é dividido em três camadas principais:

- **Backend (`backend/`)** – API REST feita em Node.js com integração a banco de dados MySQL.
- **Frontend (`frontend/`)** – Interface web com React, usada pelos administradores das lojas.
- **Bot (`BotVendas/`)** – Integração com WhatsApp, usando Node.js para interpretar e responder mensagens automaticamente.

---

## 🚀 Tecnologias Utilizadas

| Camada       | Tecnologias                     |
|--------------|----------------------------------|
| Backend      | Node.js, Express, MySQL         |
| Frontend     | React.js, CSS puro              |
| Bot          | Node.js, WhatsApp Web JS        |

---

## 🛠 Instalação e Execução

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/Anthony17DEV/BotVendas.git
cd bot-vendas
```

### 2️⃣ Backend (API)
```bash
cd backend
npm install
cp .env.example .env  # Configure suas variáveis
npm start
```

### 3️⃣ Frontend (Painel Web)
```bash
cd frontend
npm install
npm start
```

### 4️⃣ Bot de WhatsApp
```bash
cd BotVendas
npm install
npm start
```

---

## 🎯 Funcionalidades Implementadas

- Cadastro de empresas e bancos de dados isolados
- Sistema de login e autenticação
- Cadastro e edição de produtos
- Dashboard com indicadores e produtos em destaque
- Integração com WhatsApp para automação de mensagens
- Gerenciamento de pedidos

---

## 💾 Banco de Dados

Para restaurar o banco padrão:
```bash
mysql -u seu_usuario -p < rzbotvendas.sql
```

---

## 🔮 Roadmap / Próximas Entregas

- [ ] Configuração visual e lógica dos fluxos do bot
- [ ] Painel de pedidos com controle de status
- [ ] Notificações automáticas via WhatsApp
- [ ] Relatórios por período (vendas e estoque)
- [ ] Integração com meios de pagamento

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch com sua melhoria (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: minha melhoria'`)
4. Envie um push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

---

**Desenvolvido com 💡 por YNF ANTHONY**  
