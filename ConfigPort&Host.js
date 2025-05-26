const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '3000';

export const API_URL = `http://${API_HOST}:${API_PORT}`;