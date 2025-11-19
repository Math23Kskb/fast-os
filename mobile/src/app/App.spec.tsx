import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';
import { View } from 'react-native';

jest.mock('../navigation/AppNavigator', () => {
  const { View } = require('react-native');
  return () => <View testID="app-navigator-mock" />;
});

describe('<App />', () => {
  it('deve renderizar o AppNavigator mockado', () => {
    render(<App />);

    const appNavigatorMock = screen.getByTestId('app-navigator-mock');

    expect(appNavigatorMock).toBeTruthy();
  });
});
