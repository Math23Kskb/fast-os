// mobile/src/services/authService.spec.ts

import apiClient from './api';
import { loginUser } from './authService';
import { LoginResponse } from '../types/auth';

jest.mock('./api');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data on successful login', async () => {
    const credentials = { username: 'testuser', password: 'password123' };
    const fakeResponse: { data: LoginResponse } = {
      data: {
        token: 'fake-jwt-token',
      },
    };

    mockedApiClient.post.mockResolvedValueOnce(fakeResponse);

    const result = await loginUser(credentials);
    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/auth/login',
      credentials
    );
    expect(result).toEqual(fakeResponse.data);
  });

  it('should throw an error when API returns a response error', async () => {
    const credentials = { username: 'testuser', password: 'wrongpassword' };
    const apiError = {
      response: {
        data: { message: 'Credenciais inválidas' },
      },
    };

    mockedApiClient.post.mockRejectedValue(apiError);

    await expect(loginUser(credentials)).rejects.toThrow(
      'Erro ao tentar fazer login.'
    );
    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/auth/login',
      credentials
    );
  });

  it('should throw a generic error for network or other non-response errors', async () => {
    const credentials = { username: 'testuser', password: 'password123' };
    const networkError = new Error('Network Error');

    mockedApiClient.post.mockRejectedValue(networkError);

    await expect(loginUser(credentials)).rejects.toThrow(
      'Erro de rede ou servidor indisponivel.'
    );
    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/auth/login',
      credentials
    );
  });
});
