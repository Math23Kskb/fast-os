import * as SecureStore from 'expo-secure-store';
import { getToken, setToken, clearToken } from './tokenManager';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const TOKEN_KEY = 'authToken';

const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
  /* mock */
});

describe('tokenManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve salvar o token corretamente', async () => {
    await setToken('meu-token-secreto');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      TOKEN_KEY,
      'meu-token-secreto'
    );
  });

  it('deve recuperar o token corretamente', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      'token-recuperado'
    );

    const token = await getToken();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
    expect(token).toBe('token-recuperado');
  });

  it('deve retornar null se não houver token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const token = await getToken();

    expect(token).toBeNull();
  });

  it('deve limpar (remover) o token corretamente', async () => {
    await clearToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
  });

  it('deve lançar erro ao falhar em salvar o token', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
      new Error('Erro nativo')
    );

    await expect(setToken('token')).rejects.toThrow(
      'Não foi possível salvar a credencial no dispositivo.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('deve lançar erro ao falhar em buscar o token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
      new Error('Erro nativo')
    );

    await expect(getToken()).rejects.toThrow(
      'Não foi possível acessar o armazenamento de credenciais.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('deve lançar erro ao falhar em limpar o token', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
      new Error('Erro nativo')
    );

    await expect(clearToken()).rejects.toThrow(
      'Não foi possível limpar a sessão do dispositivo.'
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
