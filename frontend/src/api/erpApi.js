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

export default erpApi;