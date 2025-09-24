import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService';
import apiService from '../services/apiService';
import { FiPackage, FiArchive, FiDollarSign, FiArrowLeft } from 'react-icons/fi';

const StatCard = ({ icon, title, value, colorClass }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className={`text-4xl mb-4 ${colorClass}`}>{icon}</div>
        <h2 className="text-lg font-semibold text-slate-400">{title}</h2>
        <p className={`text-4xl font-bold mt-2 ${colorClass}`}>{value}</p>
    </div>
);

const StatCardSkeleton = () => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 text-center animate-pulse">
        <div className="h-10 w-10 bg-slate-700 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-700 rounded w-3/4 mx-auto"></div>
        <div className="h-10 bg-slate-700 rounded w-1/2 mx-auto mt-2"></div>
    </div>
);

const DashboardEstoque = () => {
    const [indicadores, setIndicadores] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const result = await apiService.getEstoqueIndicadores();
                setIndicadores(result.data);
            } catch (err) {
                console.error("Erro ao buscar indicadores:", err);
                setError("Não foi possível carregar os indicadores. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            return "R$ 0,00";
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-8 text-slate-50">
            <div className="w-full max-w-6xl">
                <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">📈 Visão Geral do Estoque</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center mb-8">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
                            <StatCard 
                                icon={<FiPackage />}
                                title="Produtos Cadastrados"
                                value={indicadores?.totalProdutos || 0}
                                colorClass="text-sky-400"
                            />
                            <StatCard 
                                icon={<FiArchive />}
                                title="Itens no Estoque"
                                value={indicadores?.totalQuantidade || 0}
                                colorClass="text-emerald-400"
                            />
                            <StatCard 
                                icon={<FiDollarSign />}
                                title="Valor Total do Estoque"
                                value={formatCurrency(indicadores?.totalValor)}
                                colorClass="text-amber-400"
                            />
                        </>
                    )}
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        <FiArrowLeft />
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardEstoque;