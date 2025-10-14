-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 07/05/2025 às 22:08
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `rzbotvendas`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresas`
--

CREATE TABLE `empresas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `proprietario` varchar(255) DEFAULT NULL,
  `tipo_negocio` varchar(100) DEFAULT NULL,
  `localizacao` text DEFAULT NULL,
  `banco_dados` varchar(255) NOT NULL,
  `cnpj_cpf` varchar(20) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `site` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `horario_funcionamento` text DEFAULT NULL,
  `formas_pagamento` text DEFAULT NULL,
  `plano_ativo` varchar(50) DEFAULT NULL,
  `status_empresa` varchar(50) DEFAULT 'ativo',
  `logo_url` varchar(255) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `empresas`
--

INSERT INTO `empresas` (`id`, `nome`, `email`, `telefone`, `proprietario`, `tipo_negocio`, `localizacao`, `banco_dados`, `cnpj_cpf`, `instagram`, `whatsapp`, `site`, `descricao`, `horario_funcionamento`, `formas_pagamento`, `plano_ativo`, `status_empresa`, `logo_url`, `observacoes`, `criado_em`) VALUES
(27, 'Drip de Negrão', 'airanthony17@gmail.com', '84994624081', 'Anthony Anderson ', 'Loja de Roupas', 'Tibau-RN', 'empresa_13098766492', '130.987.664-92', '', '558494624081', '', '', '08:00 - 18:00', '[\"Pix\",\"Cartão de Crédito\",\"Cartão de Débito\",\"Dinheiro\"]', 'Premium', 'Ativo', NULL, '', '2025-03-26 09:00:52');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `banco_dados` (`banco_dados`),
  ADD UNIQUE KEY `cnpj_cpf` (`cnpj_cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
