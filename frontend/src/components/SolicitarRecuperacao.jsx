import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const SolicitarRecuperacao = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ type: '', message: '' });

        try {
            const result = await apiService.requestPasswordReset(email);
            setNotification({ type: 'success', message: result.message });
            setSuccess(true); 
        } catch (error) {
            setNotification({ type: 'success', message: 'Se o email estiver cadastrado, um link de redefinição foi enviado.' });
            setSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-8">
                    <div className="text-center mb-6">
                        <FiMail className="mx-auto h-12 w-12 text-sky-400" />
                        <h2 className="mt-4 text-3xl font-bold text-slate-50">
                            Recuperar Senha
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Digite seu email e enviaremos um link para você criar uma nova senha.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center p-4 bg-green-500/20 text-green-300 rounded-md">
                            <FiCheckCircle className="mx-auto h-10 w-10 mb-4" />
                            <p>{notification.message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {notification.message && (
                                <div className={`p-4 rounded-md text-sm text-center bg-red-500/20 text-red-300`}>
                                    {notification.message}
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="seu.email@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="button-submit w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="font-medium text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-center gap-2">
                            <FiArrowLeft />
                            Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolicitarRecuperacao;