const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '3000';

let API_URL = '';

if (API_HOST.startsWith('http')) {
  API_URL = API_HOST; // ya es un dominio completo con protocolo
} else {
  API_URL = `http://${API_HOST}:${API_PORT}`;
}

export { API_URL };
