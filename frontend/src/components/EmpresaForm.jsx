import React, { useState } from 'react';

const initialFormState = {
    nome: '',
    email: '',
    senha: '', 
    telefone: '',
    proprietario: '',
    tipo_negocio: '',
    localizacao: '',
    cnpj_cpf: '',
    horario_abertura: '',
    horario_fechamento: '',
    formas_pagamento: [],
    plano_ativo: 'Premium',
    status_empresa: 'Ativo',
    instagram: '',
    whatsapp: '',
    site: '',
    descricao: '',
    observacoes: ''
};

const EmpresaForm = ({ onSubmit }) => {
    const [novaEmpresa, setNovaEmpresa] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tiposNegocio = [
        "Loja de Roupas", "Restaurante", "Pizzaria", "Farmácia",
        "Pet Shop", "Loja de Açaí e Sorveteria"
    ];
    const formasPagamentoOptions = [
        "Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Boleto", "Transferência Bancária"
    ];
    const planosOptions = ["Gratuito", "Básico", "Premium"];
    const statusOptions = ["Ativo", "Inativo", "Espera de Pagamento"];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const horario_funcionamento = `${novaEmpresa.horario_abertura} - ${novaEmpresa.horario_fechamento}`;
        
        const success = await onSubmit({ ...novaEmpresa, horario_funcionamento });

        if (success) {
            setNovaEmpresa(initialFormState); 
            document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="empresa-form">
            <h3>Cadastrar Nova Empresa</h3>

            <fieldset>
                <legend>Informações Principais</legend>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="nome">Nome da loja*</label>
                        <input id="nome" name="nome" value={novaEmpresa.nome} onChange={handleInputChange} required className="form-input" placeholder="Ex: Calçados & Cia" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="proprietario">Proprietário*</label>
                        <input id="proprietario" name="proprietario" value={novaEmpresa.proprietario} onChange={handleInputChange} required className="form-input" placeholder="Ex: João da Silva" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email de Login*</label>
                        <input id="email" name="email" type="email" value={novaEmpresa.email} onChange={handleInputChange} required className="form-input" placeholder="Ex: joao.silva@email.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="senha">Senha Provisória*</label>
                        <input id="senha" name="senha" type="password" value={novaEmpresa.senha} onChange={handleInputChange} required className="form-input" placeholder="Mínimo 6 caracteres" minLength="6" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cnpj_cpf">CNPJ ou CPF*</label>
                        <input id="cnpj_cpf" name="cnpj_cpf" value={novaEmpresa.cnpj_cpf} onChange={handleInputChange} required className="form-input" placeholder="Somente números" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telefone">Telefone Comercial*</label>
                        <input id="telefone" name="telefone" type="tel" value={novaEmpresa.telefone} onChange={handleInputChange} required className="form-input" placeholder="(99) 99999-9999" />
                    </div>
                    <div className="input-group grid-col-span-2">
                        <label htmlFor="localizacao">Localização*</label>
                        <input id="localizacao" name="localizacao" value={novaEmpresa.localizacao} onChange={handleInputChange} required className="form-input" placeholder="Ex: Rua Principal, 123, Centro, Cidade-UF" />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Detalhes do Negócio</legend>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="tipo_negocio">Tipo de Negócio*</label>
                        <select id="tipo_negocio" name="tipo_negocio" value={novaEmpresa.tipo_negocio} onChange={handleInputChange} required className="form-select">
                            <option value="" disabled>Selecione um tipo</option>
                            {tiposNegocio.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Horário de Funcionamento*</label>
                        <div className='hora-funcionamento'>
                            <input type="time" name="horario_abertura" value={novaEmpresa.horario_abertura} onChange={handleInputChange} required className="form-input" />
                            <span>até</span>
                            <input type="time" name="horario_fechamento" value={novaEmpresa.horario_fechamento} onChange={handleInputChange} required className="form-input" />
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Formas de Pagamento Aceitas*</legend>
                <div className="checkbox-group">
                    {formasPagamentoOptions.map(metodo => (
                        <label key={metodo} className="checkbox-label">
                            <input type="checkbox" value={metodo} onChange={handleFormasPagamentoChange} />
                            {metodo}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend>Plano e Status</legend>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="plano_ativo">Plano Ativo*</label>
                        <select id="plano_ativo" name="plano_ativo" value={novaEmpresa.plano_ativo} onChange={handleInputChange} required className="form-select">
                            {planosOptions.map(plano => <option key={plano} value={plano}>{plano}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="status_empresa">Status da Empresa*</label>
                        <select id="status_empresa" name="status_empresa" value={novaEmpresa.status_empresa} onChange={handleInputChange} required className="form-select">
                            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Presença Online e Outros Detalhes</legend>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="whatsapp">WhatsApp (para o bot)</label>
                        <input id="whatsapp" name="whatsapp" type="tel" value={novaEmpresa.whatsapp} onChange={handleInputChange} className="form-input" placeholder="84999999999 (DDD + Número)" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="instagram">Instagram</label>
                        <input id="instagram" name="instagram" value={novaEmpresa.instagram} onChange={handleInputChange} className="form-input" placeholder="Ex: @nome_da_loja" />
                    </div>
                    <div className="input-group grid-col-span-2">
                         <label htmlFor="site">Site</label>
                        <input id="site" name="site" type="url" value={novaEmpresa.site} onChange={handleInputChange} className="form-input" placeholder="Ex: https://www.seusite.com.br" />
                    </div>
                    <div className="input-group grid-col-span-2">
                        <label htmlFor="descricao">Descrição Curta</label>
                        <textarea id="descricao" name="descricao" value={novaEmpresa.descricao} onChange={handleInputChange} className="form-textarea" rows="3" placeholder="Fale um pouco sobre a sua loja..."></textarea>
                    </div>
                    <div className="input-group grid-col-span-2">
                        <label htmlFor="observacoes">Observações Internas</label>
                        <textarea id="observacoes" name="observacoes" value={novaEmpresa.observacoes} onChange={handleInputChange} className="form-textarea" rows="3" placeholder="Informações visíveis apenas para o administrador."></textarea>
                    </div>
                </div>
            </fieldset>

            <div className="criar-empresa">
                <button type="submit" className="button-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Criando Empresa...' : 'Criar Empresa'}
                </button>
            </div>
        </form>
    );
};

export default EmpresaForm;