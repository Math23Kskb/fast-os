import axios from 'axios';
import { getToken } from './tokenManager';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    console.log(
      '[INTERCEPTOR] Token encontrado no SecureStore:',
      token ? `...${token}` : 'NENHUM'
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        '[INTERCEPTOR] Header Authorization sendo enviado:',
        config.headers.Authorization
      );
    }

    console.log(
      `[API REQUEST] Saindo: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    console.log(
      `[API REQUEST] Saindo: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
