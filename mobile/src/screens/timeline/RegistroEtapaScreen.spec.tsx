import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegistroEtapaScreen from './RegistroEtapaScreen';

describe('RegistroEtapaScreen', () => {
  it('renderiza checklist e botão', () => {
    const { getByText } = render(<RegistroEtapaScreen />);

    expect(getByText('Registro de Etapa')).toBeTruthy();
    expect(getByText('Registrar horário')).toBeTruthy();
  });
});
