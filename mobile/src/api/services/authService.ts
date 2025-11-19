import apiClient from '../apiClient';
import { LoginRequest, LoginResponse, ApiError } from '../../types/auth';
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
    // logErrorToMonitoringService(error); Sentry
    console.error('[authService] Falha no login:', error);

    const axiosError: AxiosError = error as AxiosError<ApiError>;
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        throw new Error('Usuário ou senha inválidos.');
      } else {
        throw new Error(
          'Ocorreu um problema no servidor. Por favor, tente novamente mais tarde.'
        );
      }
    } else if (axiosError.request) {
      throw new Error(
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
      );
    } else {
      throw new Error('Ocorreu um erro inesperado ao tentar fazer o login.');
    }
  }
};
