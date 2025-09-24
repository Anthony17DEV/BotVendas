import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiClipboard, FiLogOut } from 'react-icons/fi';
import { authService } from '../services/authService';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Bot<span className="logo-accent">Vendas</span></h1>
                    <p className="loja-nome">{user?.nome_empresa}</p>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end>
                        <FiGrid /> Visão Geral
                    </NavLink>
                    <NavLink to="/pedidos">
                        <FiClipboard /> Pedidos
                    </NavLink>
                    <NavLink to="/estoque">
                        <FiBox /> Estoque
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout}>
                        <FiLogOut /> Sair
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
};

export default DashboardLayout;