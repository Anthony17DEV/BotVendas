import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './CadastrarItem.css'; 

const CadastrarItem = () => {
    const [camposEstoque, setCamposEstoque] = useState([]);
    const [itemData, setItemData] = useState({});
    const [imagem, setImagem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampos = async () => {
            try {
                const result = await apiService.getEstoqueCampos();
                setCamposEstoque(result.data || []);
            } catch (err) {
                setNotification({ type: 'error', message: err.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCampos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ type: '', message: '' });

        const formData = new FormData();
        for (const key in itemData) {
            formData.append(key, itemData[key]);
        }
        if (imagem) {
            formData.append('imagem', imagem);
        }

        try {
            await apiService.createEstoqueItem(formData);
            setNotification({ type: 'success', message: 'Item cadastrado com sucesso! Redirecionando...' });
            setTimeout(() => navigate('/estoque'), 2000);
        } catch (err) {
            setNotification({ type: 'error', message: err.message });
            setIsSubmitting(false);
        }
    };
    
    const formatLabel = (text) => {
        return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const renderInput = (campo) => {
        const tipoLower = campo.tipo.toLowerCase();
        
        if (tipoLower.startsWith('enum')) {
            const options = tipoLower.replace(/enum\(|\)|\'/g, '').split(',');
            return (
                <select name={campo.nome} onChange={handleChange} defaultValue="" className="form-select" required>
                    <option value="" disabled>Selecione...</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        if (tipoLower.startsWith('boolean')) {
            return <input type="checkbox" name={campo.nome} onChange={e => handleChange({ target: { name: e.target.name, value: e.target.checked }})} className="form-checkbox"/>
        }
        if (tipoLower.startsWith('text')) {
            return <textarea name={campo.nome} onChange={handleChange} className="form-textarea" rows="3" />
        }
        
        const inputType = tipoLower.includes('int') || tipoLower.includes('decimal') ? 'number' : 'text';
        return <input type={inputType} name={campo.nome} onChange={handleChange} className="form-input" required />;
    }

    if (isLoading) {
        return <div className="loading-container">Carregando formulário...</div>;
    }

    return (
        <div className="cadastrar-container">
            <form onSubmit={handleSubmit} className="cadastrar-card">
                <h2>Cadastrar Novo Item</h2>
                
                {notification.message && <div className={`notification ${notification.type}`}>{notification.message}</div>}
                
                <div className="form-grid">
                    {camposEstoque.map((campo) => (
                        <div key={campo.nome} className="input-group">
                            <label htmlFor={campo.nome}>{formatLabel(campo.nome)}</label>
                            {renderInput(campo)}
                        </div>
                    ))}
                    <div className="input-group">
                        <label htmlFor="imagem">Imagem do Produto</label>
                        <input id="imagem" name="imagem" type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} className="form-input-file" />
                    </div>
                </div>

                <button type="submit" className="button-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Item'}
                </button>
            </form>

            <button onClick={() => navigate('/estoque')} className="button-link-voltar">
                Voltar ao Estoque
            </button>
        </div>
    );
};

export default CadastrarItem;