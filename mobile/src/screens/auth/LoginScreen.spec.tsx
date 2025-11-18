import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../../api/services/authService';
import { LoginScreen } from './LoginScreen';

jest.mock('../../api/services/authService');
jest.mock('expo-secure-store');
jest.spyOn(Alert, 'alert');

const mockedLoginUser = loginUser as jest.Mock;
const mockedSetItemAsync = SecureStore.setItemAsync as jest.Mock;
const mockedAlert = Alert.alert as jest.Mock;

describe('<Login Screen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial form elements', () => {
    render(<LoginScreen />);

    expect(screen.getByPlaceholderText('Usuário')).toBeTruthy();
    expect(screen.getByPlaceholderText('Senha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeTruthy();
    expect(screen.queryByTestId('activity-indicator')).toBeNull();
  });

  it('handles a successful login flow', async () => {
    const devSettingsSpy = jest
      .spyOn(require('react-native'), 'DevSettings', 'get')
      .mockReturnValue({ reload: jest.fn() });
    const fakeUserData = { token: 'fake-jwt-token' };
    mockedLoginUser.mockResolvedValue(fakeUserData);

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Usuário'), 'testuser');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'password123');

    fireEvent.press(screen.getByRole('button', { name: /entrar/i }));

    const spinner = await screen.findByTestId('activity-indicator');
    expect(spinner).toBeTruthy();

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'authToken',
      'fake-jwt-token'
    );

    expect(screen.queryByTestId('activity-indicator')).toBeNull();

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });

    expect(mockedSetItemAsync).toHaveBeenCalledWith(
      'authToken',
      'fake-jwt-token'
    );

    await waitFor(() => {
      expect(devSettingsSpy().reload).toHaveBeenCalled();
    });

    devSettingsSpy.mockRestore();
  });

  it('handles a failed login flow', async () => {
    const errorMessage = 'Usuário ou senha inválidos';
    mockedLoginUser.mockRejectedValue(new Error(errorMessage));

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Usuário'), 'wronguser');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'wrongpass');
    fireEvent.press(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith({
        username: 'wronguser',
        password: 'wrongpass',
      });
    });

    expect(mockedSetItemAsync).not.toHaveBeenCalled();
    expect(mockedAlert).toHaveBeenCalledWith('Erro no Login', errorMessage);
  });

  it('shows an alert if username or password are not provided', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByRole('button', { name: /entrar/i }));

    expect(mockedLoginUser).not.toHaveBeenCalled();

    expect(mockedAlert).toHaveBeenCalledWith(
      'Erro',
      'Por favor, preencha o usuário e a senha.'
    );
  });
});
