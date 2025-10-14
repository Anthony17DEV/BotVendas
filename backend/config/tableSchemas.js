const schemas = {
    usuarios: `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            nome VARCHAR(255),
            senha VARCHAR(255) NOT NULL,
            cargo ENUM('admin', 'funcionario') DEFAULT 'admin', -- Controle de permissão futuro
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    pedidos: `
        CREATE TABLE IF NOT EXISTS pedidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            codigo_pedido VARCHAR(20) UNIQUE NOT NULL, -- Um código mais amigável para o cliente (ex: #PED1023)
            nome_cliente VARCHAR(255) NOT NULL,
            telefone_cliente VARCHAR(20),
            itens JSON NOT NULL, -- Usar JSON é mais flexível para guardar os produtos do carrinho
            subtotal DECIMAL(10,2) NOT NULL,
            taxa_entrega DECIMAL(10,2) DEFAULT 0.00,
            desconto DECIMAL(10,2) DEFAULT 0.00,
            total DECIMAL(10,2) NOT NULL,
            status ENUM('Pendente', 'Confirmado', 'Em Preparo', 'Pronto para Retirada', 'A Caminho', 'Entregue', 'Cancelado') DEFAULT 'Pendente',
            tipo_entrega ENUM('entrega', 'retirada') NOT NULL,
            endereco_entrega TEXT, -- Pode ser um JSON com rua, número, bairro, etc.
            forma_pagamento VARCHAR(50),
            observacao TEXT, -- Observações do cliente (ex: "sem cebola")
            data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    estoque: {
        padrao: `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                quantidade INT DEFAULT 0,
                unidade_medida VARCHAR(20) DEFAULT 'un', -- ex: 'un', 'kg', 'pacote'
                sku VARCHAR(100) UNIQUE, -- Código de barras ou de controle interno
                categoria VARCHAR(100),
                disponivel BOOLEAN DEFAULT TRUE,
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Loja de Roupas': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL, /* Ex: Camiseta Gola V */
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                quantidade INT NOT NULL,
                tamanho VARCHAR(20), /* Ex: P, M, G, GG, 42 */
                cor VARCHAR(50),
                marca VARCHAR(100),
                genero ENUM('Masculino', 'Feminino', 'Unissex'),
                sku VARCHAR(100) UNIQUE,
                categoria VARCHAR(100), /* Ex: Camisetas, Calças, Acessórios */
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Restaurante': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL, /* Ex: X-Tudo, Porção de Fritas */
                descricao TEXT, /* Ex: Pão, bife, queijo, alface... */
                preco DECIMAL(10,2) NOT NULL,
                categoria ENUM('Bebida', 'Lanche', 'Pizza', 'Prato Feito', 'Sobremesa', 'Acompanhamento', 'Combo'),
                disponivel BOOLEAN DEFAULT TRUE, /* Controle de disponibilidade é mais comum que de quantidade */
                tempo_preparo_min INT, /* Tempo estimado em minutos */
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Pizzaria': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sabor VARCHAR(255) NOT NULL, /* Ex: Calabresa, Quatro Queijos */
                descricao TEXT, /* Ingredientes */
                preco_brotinho DECIMAL(10,2),
                preco_media DECIMAL(10,2),
                preco_grande DECIMAL(10,2),
                preco_familia DECIMAL(10,2),
                categoria ENUM('Salgada Tradicional', 'Salgada Especial', 'Doce', 'Bebida'),
                disponivel BOOLEAN DEFAULT TRUE,
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Farmácia': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome_comercial VARCHAR(255) NOT NULL,
                principio_ativo VARCHAR(255),
                laboratorio VARCHAR(100),
                dosagem VARCHAR(50), /* Ex: 500mg, 20ml/g */
                preco DECIMAL(10,2) NOT NULL,
                quantidade INT NOT NULL,
                requer_receita BOOLEAN DEFAULT FALSE,
                ean VARCHAR(13) UNIQUE, /* Código de barras universal */
                categoria ENUM('Medicamento', 'Perfumaria', 'Higiene', 'Suplemento', 'Infantil'),
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Pet Shop': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                marca VARCHAR(100),
                preco DECIMAL(10,2) NOT NULL,
                quantidade INT NOT NULL,
                animal_alvo ENUM('Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Roedor', 'Todos'),
                porte ENUM('Pequeno', 'Médio', 'Grande', 'Todos'),
                idade_alvo ENUM('Filhote', 'Adulto', 'Sênior', 'Todos'),
                categoria ENUM('Ração', 'Petisco', 'Brinquedo', 'Higiene', 'Acessório', 'Medicamento'),
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `,
        'Loja de Açaí e Sorveteria': `
            CREATE TABLE IF NOT EXISTS estoque (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL, /* Ex: Açaí com Morango, Sorvete de Chocolate */
                descricao TEXT,
                preco_p DECIMAL(10,2), /* Preço para copo/pote pequeno */
                preco_m DECIMAL(10,2), /* Preço para copo/pote médio */
                preco_g DECIMAL(10,2), /* Preço para copo/pote grande */
                categoria ENUM('Açaí', 'Cupuaçu', 'Sorvete de Massa', 'Picolé', 'Bebida'),
                disponivel BOOLEAN DEFAULT TRUE,
                imagem_url TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `
    },
    tokens_recuperacao: `
    CREATE TABLE IF NOT EXISTS tokens_recuperacao (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expiracao DATETIME NOT NULL,
        INDEX (email)
    );
`,
};

module.exports = schemas;