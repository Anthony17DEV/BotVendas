const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const API_URL = process.env.MAIN_API_URL;

exports.getStoreDataByNumber = async (number) => {
    const res = await fetch(`${API_URL}/empresas/por-numero-bot/${number}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Não foi possível buscar os dados da loja.');
    }
    return res.json();
};

exports.getStoreStock = async (storeId) => {
    const res = await fetch(`${API_URL}/empresas/estoque/${storeId}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Não foi possível buscar o estoque da loja.');
    }
    return res.json();
};

exports.registerOrder = async (orderData) => {
    const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Falha ao registrar pedido.');
    }
    return res.json();
};