import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/apiService';
import { authService } from '../services/authService';
import './EditarItem.css'; 

const formatLabel = (text) => {
    if (!text) return '';
    return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const renderInput = (campo, item, handleChange) => {
    const tipoLower = campo.tipo.toLowerCase();
    const nomeCampo = campo.nome;

    if (tipoLower.startsWith('enum')) {
        const options = tipoLower.replace(/enum\(|\)|\'/g, '').split(',');
        return (
            <select name={nomeCampo} value={item[nomeCampo] || ''} onChange={handleChange} className="form-select">
                <option value="">Selecione...</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        );
    }
    
    if (tipoLower.startsWith('boolean') || tipoLower.startsWith('tinyint(1)')) {
        return (
            <div className="checkbox-container-edit">
                <input 
                    type="checkbox" 
                    name={nomeCampo} 
                    id={nomeCampo}
                    checked={!!item[nomeCampo]} 
                    onChange={handleChange} 
                    className="form-checkbox"
                />
                <label htmlFor={nomeCampo}>Ativo / Disponível</label>
            </div>
        );
    }

    if (tipoLower.startsWith('text')) {
        return (
            <textarea 
                name={nomeCampo} 
                value={item[nomeCampo] || ''} 
                onChange={handleChange} 
                className="form-textarea" 
                rows="3" 
            />
        );
    }
    
    const inputType = tipoLower.includes('int') || tipoLower.includes('decimal') ? 'number' : 'text';
    return (
        <input 
            type={inputType} 
            name={nomeCampo} 
            value={item[nomeCampo] || ''} 
            onChange={handleChange} 
            className="form-input" 
            step={tipoLower.includes('decimal') ? '0.01' : '1'}
        />
    );
};

const EditarItem = () => {
    const [campos, setCampos] = useState([]);
    const [item, setItem] = useState(null);
    const [novaImagem, setNovaImagem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [camposResult, itemResult] = await Promise.all([
                    apiService.getEstoqueCampos(),
                    apiService.getEstoqueItemById(id)
                ]);
                setCampos(camposResult.data || []);
                setItem(itemResult.data || {});
            } catch (err) {
                console.error("Erro ao carregar dados para edição:", err);
                setNotification({ type: 'error', message: err.message || "Não foi possível carregar os dados do item." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const valorFinal = type === 'checkbox' ? (checked ? 1 : 0) : value;
        setItem(prev => ({ ...prev, [name]: valorFinal }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ type: '', message: '' });

        const formData = new FormData();
        const { imagem_url, ...itemParaEnvio } = item;

        for (const key in itemParaEnvio) {
            formData.append(key, itemParaEnvio[key] === null ? '' : itemParaEnvio[key]);
        }
        if (novaImagem) {
            formData.append('imagem', novaImagem);
        }

        try {
            await apiService.updateEstoqueItem(id, formData);
            setNotification({ type: 'success', message: 'Item atualizado com sucesso! Redirecionando...' });
            setTimeout(() => navigate('/estoque'), 2000);
        } catch (err) {
            setNotification({ type: 'error', message: err.message });
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="loading-container">Carregando dados do item...</div>;
    }

    if (!item) {
        return <div className="loading-container">{notification.message || "Item não encontrado."}</div>;
    }

    const imagemUrl = item.imagem_url ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${item.imagem_url}` : null;

    return (
        <div className="container-geral-form">
            <form onSubmit={handleSubmit} className="card-form">
                <h2>Editar Item do Estoque</h2>
                {notification.message && <div className={`notification ${notification.type}`}>{notification.message}</div>}
                
                <div className="form-grid">
                    {campos.map((campo) => (
                        <div key={campo.nome} className="input-group">
                            <label htmlFor={campo.nome}>{formatLabel(campo.nome)}</label>
                            {renderInput(campo, item, handleChange)}
                        </div>
                    ))}
                    <div className="input-group grid-col-span-2">
                        <label htmlFor="imagem">Alterar Imagem</label>
                        {imagemUrl && <img src={imagemUrl} alt="Imagem atual" className="imagem-preview" />}
                        <input id="imagem" name="imagem" type="file" accept="image/*" onChange={(e) => setNovaImagem(e.target.files[0])} className="form-input-file" />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate("/estoque")} className="button-secondary">
                        Cancelar
                    </button>
                    <button type="submit" className="button-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarItem;