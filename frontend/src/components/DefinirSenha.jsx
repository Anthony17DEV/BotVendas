import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { FiLock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const DefinirSenha = () => {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setNotification({ type: 'error', message: 'Token de redefinição não encontrado na URL.' });
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ type: '', message: '' });

        if (!novaSenha || !confirmarSenha) {
            setNotification({ type: 'error', message: 'Por favor, preencha os dois campos.' });
            return;
        }
        if (novaSenha.length < 6) {
            setNotification({ type: 'error', message: 'A senha deve ter no mínimo 6 caracteres.' });
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setNotification({ type: 'error', message: 'As senhas não coincidem.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await apiService.resetPassword(token, novaSenha);
            setNotification({ type: 'success', message: result.message });
            setSuccess(true); 
        } catch (error) {
            setNotification({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-8">
                    <div className="text-center mb-6">
                        <FiLock className="mx-auto h-12 w-12 text-sky-400" />
                        <h2 className="mt-4 text-3xl font-bold text-slate-50">
                            Definir Nova Senha
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Escolha uma senha forte e segura para proteger sua conta.
                        </p>
                    </div>

                    {notification.message && (
                        <div className={`p-4 mb-4 rounded-md text-sm ${
                            notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                            {notification.message}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center">
                            <FiCheckCircle className="mx-auto h-10 w-10 text-green-400 mb-4" />
                            <p className="text-slate-300">Sua senha foi alterada com sucesso.</p>
                            <Link to="/login" className="mt-6 inline-block w-full px-4 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-300">
                                Ir para o Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="input-group">
                                <label htmlFor="nova-senha" className="block text-sm font-medium text-slate-400 mb-2">Nova Senha</label>
                                <input
                                    id="nova-senha"
                                    type="password"
                                    placeholder="••••••••"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    className="form-input"
                                    disabled={!token}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmar-senha" className="block text-sm font-medium text-slate-400 mb-2">Confirmar Nova Senha</label>
                                <input
                                    id="confirmar-senha"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    className="form-input"
                                    disabled={!token}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="button-submit w-full"
                                disabled={isSubmitting || !token}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DefinirSenha;