import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from '../services/apiService';
import { authService } from '../services/authService';
import { FiLogIn, FiLock, FiMail } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ type: '', message: '' });

        try {
            const result = await apiService.login(email, senha);
            
            authService.login(result.usuario, result.token);

            navigate("/dashboard");
        } catch (error) {
            setNotification({ type: 'error', message: error.message || "Erro de conexão com o servidor" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-50">Bot<span className="text-sky-400">Vendas</span></h1>
                    <p className="mt-2 text-slate-400">Acesse seu painel de gerenciamento.</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-8">
                    {notification.message && (
                        <div className={`p-4 mb-4 rounded-md text-sm text-center ${
                            notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                            {notification.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input pl-10" 
                                required
                            />
                        </div>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="form-input pl-10"
                                required
                            />
                        </div>
                        <div className="text-right text-sm">
                            <Link to="/solicitar-recuperacao" className="font-medium text-sky-400 hover:text-sky-500 transition-colors">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <button 
                            type="submit" 
                            className="button-submit w-full flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            <FiLogIn />
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;