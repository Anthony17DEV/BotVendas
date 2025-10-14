import React, { useState, useEffect, useCallback } from 'react';
import EmpresaForm from './EmpresaForm'; 
import EmpresasList from './EmpresasList'; 
import apiService from '../services/apiService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState('');

    const fetchEmpresas = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await apiService.getEmpresas();
            setEmpresas(Array.isArray(data.data) ? data.data : []); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);

    const handleCreateEmpresa = async (novaEmpresa) => {
        try {
            const result = await apiService.createEmpresa(novaEmpresa);
            setNotification(result.message); 
            fetchEmpresas(); 
            setTimeout(() => setNotification(''), 3000); 
            return true; 
        } catch (err) {
            setError(err.message);
            return false; 
        }
    };

    return (
        <div className="admin-container">
            <h2>Painel Administrativo</h2>

            {notification && <div className="notification success">{notification}</div>}
            {error && <div className="notification error">{error}</div>}

            <EmpresaForm onSubmit={handleCreateEmpresa} />
            <EmpresasList empresas={empresas} isLoading={isLoading} />
        </div>
    );
};

export default AdminDashboard;