import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [empresas, setEmpresas] = useState([]);
    const [novaEmpresa, setNovaEmpresa] = useState({
        nome: '',
        email: '',
        telefone: '',
        proprietario: '',
        tipo_negocio: '',
        localizacao: '',
        banco_dados: '',
        cnpj_cpf: '',
        horario_abertura: '',
        horario_fechamento: '',
        formas_pagamento: [],
        plano_ativo: '',
        status_empresa: 'Ativo',
        instagram: '',
        whatsapp: '',
        site: '',
        descricao: '',
        logo_url: '',
        observacoes: ''
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/empresas')
            .then(res => res.json())
            .then(data => {
                console.log('Dados recebidos:', data);
                setEmpresas(Array.isArray(data) ? data : []);
            })
            .catch(error => console.error('Erro ao buscar empresas:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovaEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleFormasPagamentoChange = (e) => {
        const { value, checked } = e.target;
        setNovaEmpresa(prev => {
            const novasFormas = checked
                ? [...prev.formas_pagamento, value]
                : prev.formas_pagamento.filter(item => item !== value);
            return { ...prev, formas_pagamento: novasFormas };
        });
    };

    const criarEmpresa = async () => {
        let cnpjSemMascara = novaEmpresa.cnpj_cpf.replace(/\D/g, ""); // Remove pontos e traços do CNPJ/CPF
        let nomeBanco = `empresa_${cnpjSemMascara}`.toLowerCase(); // Gera o nome do banco
    
        const dadosParaEnvio = { 
            ...novaEmpresa, 
            banco_dados: nomeBanco, // Adiciona o nome do banco antes de enviar
            formas_pagamento: novaEmpresa.formas_pagamento 
        };
    
        console.log("Enviando dados para o backend:", dadosParaEnvio); // Debug no frontend
    
        const response = await fetch('http://localhost:5000/api/empresas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnvio),
        });
    
        if (response.ok) {
            alert('Empresa criada com sucesso!');
            window.location.reload();
        } else {
            alert('Erro ao criar empresa');
        }
    };
    

    return (
        <div className="admin-container">
            <h2>Painel Administrativo</h2>

            <h3>Cadastrar Nova Empresa</h3>

            <div className="form-grid">
                <div className="input-group">
                    <label>Nome da loja*</label>
                    <input name="nome" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Email *</label>
                    <input name="email" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Telefone *</label>
                    <input name="telefone" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Proprietário *</label>
                    <input name="proprietario" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Tipo de Negócio *</label>
                    <input name="tipo_negocio" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Localização *</label>
                    <input name="localizacao" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>CNPJ ou CPF *</label>
                    <input name="cnpj_cpf" onChange={handleInputChange} />
                </div>
                <div className="input-group">
                    <label>Horário de Funcionamento *</label>
                    <div className='hora-funcionamento'>
                        <label>Abertura:</label>
                        <input type="time" name="horario_abertura" onChange={handleInputChange} />
                        <label>Fechamento:</label>
                        <input type="time" name="horario_fechamento" onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <label className="formas-pagamento">Formas de Pagamento *</label>
            <div className="checkbox-group">
                {["Pix", "Cartão de Crédito", "Cartão de Débito", "Boleto", "Dinheiro", "Transferência Bancária"].map(metodo => (
                    <label key={metodo}>
                        <input type="checkbox" value={metodo} onChange={handleFormasPagamentoChange} />
                        {metodo}
                    </label>
                ))}
            </div>

            <div className="form-grid">
                <div className="input-group">
                    <label>Plano Ativo *</label>
                    <select name="plano_ativo" onChange={handleInputChange}>
                        <option value="">Selecione um plano</option>
                        <option value="Gratuito">Gratuito</option>
                        <option value="Básico">Básico</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Status da Empresa *</label>
                    <select name="status_empresa" onChange={handleInputChange}>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Espera de Pagamento">Espera de Pagamento</option>
                    </select>
                </div>
            </div>

            <h3>Campos Opcionais</h3>
            <div className="form-grid">
                <div className="instagram">
                    <label>Instagram</label>
                    <input name="instagram" onChange={handleInputChange} />
                </div>
                <div className="whatsApp">
                    <label>WhatsApp</label>
                    <input name="whatsapp" onChange={handleInputChange} />
                </div>
                <div className="site">
                    <label>Site</label>
                    <input name="site" onChange={handleInputChange} />
                </div>
                <div className="description">
                    <label>Descrição</label>
                    <textarea name="descricao" onChange={handleInputChange}></textarea>
                </div>
                <div className="logo-url">
                    <label>Logo URL</label>
                    <input name="logo_url" onChange={handleInputChange} />
                </div>
                <div className="description">
                    <label>Observações</label>
                    <textarea name="observacoes" onChange={handleInputChange}></textarea>
                </div>
            </div>

            <div className="criar-empresa">
                <button className="button-submit" onClick={criarEmpresa}>Criar Empresa</button>
            </div>

            <div className="empresa-list">
                <h3>Empresas Cadastradas</h3>
                <ul>
                    {empresas.map(empresa => (
                        <li key={empresa.id}>
                            <strong>{empresa.nome}</strong> - {empresa.email} - <span style={{ color: "blue" }}>{empresa.banco_dados}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
