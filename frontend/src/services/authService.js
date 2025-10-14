const USER_KEY = 'botvendas_user';
const TOKEN_KEY = 'botvendas_token';

export const authService = {
    login: (userData, token) => {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_KEY, token);
    },

    logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};