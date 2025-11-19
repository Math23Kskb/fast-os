import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

const mockedGetItemAsync = SecureStore.getItemAsync as jest.Mock;

describe('apiClient Interceptor', () => {
  beforeEach(() => {
    mockedGetItemAsync.mockClear();
  });

  it('deve adicionar o header de autorização se um token existir', async () => {
    const fakeToken = 'meu-token-secreto';
    mockedGetItemAsync.mockResolvedValue(fakeToken);

    const config = { headers: {} };

    const newConfig =
      await (apiClient.interceptors.request as any).handlers[0].fulfilled(config);

    expect(newConfig.headers.Authorization).toBe(`Bearer ${fakeToken}`);
  });

  it('NÃO deve adicionar o header de autorização se não houver token', async () => {
    mockedGetItemAsync.mockResolvedValue(null);

    const config = { headers: {} };

    const newConfig =
      await (apiClient.interceptors.request as any).handlers[0].fulfilled(config);

    expect(newConfig.headers.Authorization).toBeUndefined();
  });
});
