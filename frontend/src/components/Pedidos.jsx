import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService';
import apiService from '../services/apiService';
import { FiSearch, FiArrowLeft, FiX, FiCheck, FiPrinter } from 'react-icons/fi';
import './Pedidos.css';

const StatusBadge = ({ status }) => {
    const statusClass = {
        'Pendente': 'status-pendente',
        'Confirmado': 'status-confirmado',
        'Em Preparo': 'status-preparo',
        'Entregue': 'status-entregue',
        'Cancelado': 'status-cancelado',
    }[status] || 'status-default';
    return <span className={`status-badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
};

const PedidoDetalhesModal = ({ pedido, onClose }) => {
    if (!pedido) return null;
    
    const itens = JSON.parse(pedido.itens || '[]');
    const endereco = JSON.parse(pedido.endereco_entrega || '{}');
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>Detalhes do Pedido {pedido.codigo_pedido}</h3>
                    <button onClick={onClose} className="modal-close-button"><FiX /></button>
                </header>
                <div className="modal-body">
                    <p><strong>Cliente:</strong> {pedido.nome_cliente}</p>
                    <p><strong>Telefone:</strong> {pedido.telefone_cliente}</p>
                    <p><strong>Itens do Pedido:</strong></p>
                    <ul className="lista-itens-modal">
                        {itens.map((item, index) => (
                            <li key={index}>
                                {item.quantidade}x {item.nome} - <span>{formatCurrency(item.preco * item.quantidade)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="total-modal"><strong>Total:</strong> {formatCurrency(pedido.total)}</p>
                    {pedido.tipo_entrega === 'entrega' && (
                        <p><strong>Endereço:</strong> {endereco.rua}, {endereco.numero} - {endereco.bairro}</p>
                    )}
                </div>
                <footer className="modal-footer">
                    <button onClick={() => window.print()} className="botao-secundario"><FiPrinter/> Imprimir</button>
                    <button onClick={onClose} className="botao-primario">Fechar</button>
                </footer>
            </div>
        </div>
    );
};

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [busca, setBusca] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null); 
    const navigate = useNavigate();

    const buscarPedidos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiService.getPedidos();
            setPedidos(result.data || []);
        } catch (err) {
            setError("Não foi possível carregar os pedidos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authService.isAuthenticated()) navigate("/login");
        else buscarPedidos();
    }, [navigate, buscarPedidos]);
    
    const handleUpdateStatus = async (id, status) => {
        let motivo = '';
        if (status === 'Cancelado') {
            motivo = prompt("Por favor, informe o motivo do cancelamento:");
            if (motivo === null) return; 
        }

        try {
            await apiService.updatePedidoStatus(id, status, motivo);
            buscarPedidos(); 
        } catch (err) {
            setError(err.message || "Não foi possível atualizar o status.");
        }
    };
    
    const pedidosFiltrados = useMemo(() =>
        pedidos.filter(p =>
            p.nome_cliente.toLowerCase().includes(busca.toLowerCase()) ||
            p.codigo_pedido.toLowerCase().includes(busca.toLowerCase())
        ), [pedidos, busca]);
    
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div className="container-pedidos">
            <PedidoDetalhesModal pedido={pedidoSelecionado} onClose={() => setPedidoSelecionado(null)} />

            <header className="pedidos-header">
                <h2 className="titulo-pagina">📬 Pedidos Recebidos</h2>
                <button onClick={() => navigate("/dashboard")} className="botao-secundario">
                    <FiArrowLeft /> Voltar
                </button>
            </header>
            
            <div className="painel-filtros">
                <div className="input-com-icone">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou código do pedido..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="container-tabela">
                {isLoading ? <p>Carregando pedidos...</p> : error ? <div className="notification error">{error}</div> : (
                    <table className="tabela-pedidos">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.length > 0 ? pedidosFiltrados.map((p) => (
                                <tr key={p.id} onClick={() => setPedidoSelecionado(p)} style={{cursor: 'pointer'}}>
                                    <td data-label="Código">{p.codigo_pedido}</td>
                                    <td data-label="Cliente">{p.nome_cliente}</td>
                                    <td data-label="Total">{formatCurrency(p.total)}</td>
                                    <td data-label="Status"><StatusBadge status={p.status} /></td>
                                    <td data-label="Data">{new Date(p.data_pedido).toLocaleDateString('pt-BR')}</td>
                                    <td data-label="Ações">
                                        <div className="acoes-tabela" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => handleUpdateStatus(p.id, 'Confirmado')} className="botao-acao confirmar"><FiCheck/></button>
                                            <button onClick={() => handleUpdateStatus(p.id, 'Cancelado')} className="botao-acao cancelar"><FiX/></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6">Nenhum pedido encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Pedidos;