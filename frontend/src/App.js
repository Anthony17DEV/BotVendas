import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import SolicitarRecuperacao from './components/SolicitarRecuperacao';
import DefinirSenha from './components/DefinirSenha';
import Dashboard from "./components/Dashboard";
import Pedidos from "./components/Pedidos";
import Estoque from "./components/Estoque";
import CadastrarItem from "./components/CadastrarItem";
import EditarItem from "./components/EditarItem";
import AdminDashboard from './components/AdminDashboard';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/solicitar-recuperacao" element={<SolicitarRecuperacao />} />
                <Route path="/definir-senha" element={<DefinirSenha />} />

                {/* ✅ ROTA EXCLUSIVA PARA O SUPER ADMIN ✅ */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Rotas Privadas (dentro do painel) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pedidos" element={<Pedidos />} />
                        <Route path="/estoque" element={<Estoque />} />
                        <Route path="/cadastrar-item" element={<CadastrarItem />} />
                        <Route path="/editar-item/:id" element={<EditarItem />} />
                    </Route>
                </Route>

                {/* Redirecionamento da rota raiz */}
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;