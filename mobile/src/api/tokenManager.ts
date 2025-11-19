import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('[TokenManager] Erro ao buscar o token:', error);

    throw new Error('Não foi possível acessar o armazenamento de credenciais.');
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('[TokenManager] Erro ao salvar o token:', error);
    throw new Error('Não foi possível salvar a credencial no dispositivo.');
  }
};

export const clearToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('[TokenManager] Erro ao limpar o token:', error);
    throw new Error('Não foi possível limpar a sessão do dispositivo.');
  }
};
