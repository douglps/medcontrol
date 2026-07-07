import axios from 'axios';

// Criação da instância do Axios com configurações base
const api = axios.create({
  baseURL: 'https://api.exemplo.com', // Substitua pela URL do seu backend do IFRS
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para injetar token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros (ex: token expirado / 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber um erro 401 (Não autorizado), limpa o token e redireciona ao login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
