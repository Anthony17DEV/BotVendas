import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import apiService from '../services/apiService';
import { FiBox, FiClipboard, FiLogOut, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [horaAtual, setHoraAtual] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getCurrentUser();
        setUsuario(currentUser);

        const fetchData = async () => {
            try {
                setError(null);
                const result = await apiService.getDashboardResumo();
                setDashboardData(result.data);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
                setError("Não foi possível carregar os dados do painel. Verifique sua conexão ou tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        const timer = setInterval(() => setHoraAtual(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (isLoading) {
        return <div className="loading-container">Carregando Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h2 className="dashboard-title">Bem-vindo, {usuario?.nome}!</h2>
                    <p className="dashboard-subtitle">Painel de Controle da {usuario?.nome_empresa}</p>
                </div>
                <div className="dashboard-clock">
                    {horaAtual.toLocaleDateString()} - {horaAtual.toLocaleTimeString()}
                </div>
            </header>

            {error && (
                <div className="notification error" style={{ marginBottom: '2.5rem' }}>
                    {error}
                </div>
            )}

            <div className="indicadores-grid">
                <div className="indicador-card">
                    <FiBox className="indicador-icon" />
                    <h4>Total de Produtos</h4>
                    <p>{dashboardData?.totalProdutos ?? '--'}</p>
                </div>
                <div className="indicador-card">
                    <FiTrendingUp className="indicador-icon" />
                    <h4>Itens em Estoque</h4>
                    <p>{dashboardData?.totalQuantidade ?? '--'}</p>
                </div>
                <div className="indicador-card">
                    <FiClipboard className="indicador-icon" />
                    <h4>Pedidos Hoje</h4>
                    <p>--</p> 
                </div>
            </div>

            <nav className="dashboard-nav">
                <button onClick={() => navigate('/pedidos')} className="dashboard-button primary">
                    <FiClipboard /> Ver Pedidos
                </button>
                <button onClick={() => navigate('/estoque')} className="dashboard-button secondary">
                    <FiBox /> Gerenciar Estoque
                </button>
            </nav>

            <footer className="dashboard-footer">
                <button onClick={handleLogout} className="dashboard-button danger">
                    <FiLogOut /> Sair
                </button>
            </footer>
        </div>
    );
};

export default Dashboard;