import axios from 'axios';

const erpApi = axios.create({
  baseURL: '/api', // Ruta relativa en lugar de http://localhost:8080/api
});

erpApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

erpApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si la sesión expiró o las credenciales son inválidas (401 Unauthorized / 403 Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Excluir la petición propia de login (/auth/login) para que el formulario pueda capturar el error y mostrar mensaje
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginRequest) {
        localStorage.removeItem('jwt_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default erpApi;
