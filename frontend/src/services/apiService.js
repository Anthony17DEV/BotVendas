import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Função auxiliar centralizada para todas as chamadas da API.
 * - Anexa o token de autenticação automaticamente.
 * - Trata erros de resposta da API de forma padronizada.
 */
const apiFetch = async (endpoint, options = {}) => {
    const { body, ...customOptions } = options;
    const token = authService.getToken();
    const headers = { ...customOptions.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...customOptions,
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro de servidor com status ${response.status}` }));
        throw new Error(errorData.message);
    }
    return response.json();
};

const apiService = {
    // Auth
    login: (email, senha) => apiFetch('/auth/login', {
        method: 'POST',
        body: { email, senha }
    }),

    // Recovery
    requestPasswordReset: (email) => apiFetch('/recovery/request-reset', {
        method: 'POST',
        body: { email }
    }),
    resetPassword: (token, novaSenha) => apiFetch('/recovery/reset-password', {
        method: 'POST',
        body: { token, novaSenha }
    }),

    // Empresas (Super Admin)
    getEmpresas: () => apiFetch('/empresas'),
    createEmpresa: (empresaData) => apiFetch('/empresas', {
        method: 'POST',
        body: empresaData
    }),

    // Dashboard
    getDashboardResumo: () => apiFetch('/dashboard/resumo'),

    // Estoque
    getEstoque: () => apiFetch('/estoque'),
    getEstoqueCampos: () => apiFetch('/estoque/campos'),
    getEstoqueIndicadores: () => apiFetch('/estoque/indicadores'),
    getEstoqueItemById: (itemId) => apiFetch(`/estoque/${itemId}`),
    createEstoqueItem: (formData) => apiFetch('/estoque', {
        method: 'POST',
        body: formData
    }),
    updateEstoqueItem: (itemId, formData) => apiFetch(`/estoque/${itemId}`, {
        method: 'PUT',
        body: formData
    }),
    deleteEstoqueItem: (itemId) => apiFetch(`/estoque/${itemId}`, {
        method: 'DELETE'
    }),

    getPedidos: () => apiFetch('/pedidos'),
    updatePedidoStatus: (id, status, motivo) => apiFetch(`/pedidos/${id}/status`, {
        method: 'PATCH',
        body: { status, motivo_cancelamento: motivo }
    }),
};

export default apiService;