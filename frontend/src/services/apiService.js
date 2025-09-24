import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL;

const apiFetch = async (endpoint, options = {}) => {
    const { body, ...customOptions } = options;
    const token = authService.getToken();

    const headers = {
        ...customOptions.headers,
    };

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
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ${response.status}`);
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
    getPedidos: async () => {
        const res = await fetch(`${API_URL}/pedidos`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) throw new Error('Falha ao carregar os pedidos');
        return res.json();
    },
    updatePedidoStatus: async (pedidoId, status, motivoCancelamento) => {
        const res = await fetch(`${API_URL}/pedidos/${pedidoId}/status`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ status, motivo_cancelamento: motivoCancelamento })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Erro ao atualizar o status do pedido');
        }
        return res.json();
    },
    requestPasswordReset: async (email) => {
        const res = await fetch(`${API_URL}/recovery/request-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            throw new Error('Falha na comunicação com o servidor');
        }
        return res.json();
    }
};

export default apiService;