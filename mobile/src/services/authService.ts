import apiClient from './api';
import { LoginRequest, LoginResponse, ApiError } from '../types/auth';
import { AxiosError } from 'axios';

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  } catch (error) {
    const axiosError: AxiosError = error as AxiosError<ApiError>;
    if (axiosError.response) {
      const message = 'Erro ao tentar fazer login.';
      throw new Error(message);
    }
    throw new Error('Erro de rede ou servidor indisponivel.');
  }
};
