import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from './App';
import { Linking } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { MockedInitialScreen } from '../__mocks__/InitialScreen';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Linking = {
    openURL: jest.fn(),
  };

  return RN;
});

jest.mock('../screens/auth/LoginScreen', () => ({
  LoginScreen: () => <MockedInitialScreen />,
}));

describe('<App />', () => {
  it('should render the initial application screen without crashing', () => {
    render(<App />);

    const initialScreen = screen.getByTestId('mock-initial-screen');
    expect(initialScreen).toBeTruthy();
  });
});
