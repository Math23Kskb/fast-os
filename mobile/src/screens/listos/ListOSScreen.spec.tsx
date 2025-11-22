import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { NavProps, RawListOSScreen } from './ListOSScreen';
import Visita from '../../db/models/Visita';

const mockVisitas = [
  { id: 'visita1', status: 'AGENDADA', dataChegadaCliente: null },
  { id: 'visita2', status: 'CONCLUIDA', dataChegadaCliente: new Date() },
] as unknown as Visita[];

const mockNavigationProps: NavProps = {
  navigation: {
    navigate: jest.fn(),
  } as any,
  route: {
    key: 'ListOS-key',
    name: 'ListOS',
  } as any,
};

describe('<ListOSScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza a lista de visitas corretamente', () => {
    render(<RawListOSScreen visitas={mockVisitas} {...mockNavigationProps} />);

    expect(screen.getAllByText('Visita')).toHaveLength(mockVisitas.length);
    expect(screen.getByText('ID: visita1...')).toBeTruthy();
    expect(screen.getByText('ID: visita2...')).toBeTruthy();

    expect(screen.getByText('AGENDADA')).toBeTruthy();
    expect(screen.getByText('CONCLUIDA')).toBeTruthy();
  });

  it('navega para a tela InfoOS ao clicar em uma visita', () => {
    render(<RawListOSScreen visitas={mockVisitas} {...mockNavigationProps} />);

    const item1 = screen.getByText('ID: visita1...');
    fireEvent.press(item1);

    expect(mockNavigationProps.navigation.navigate).toHaveBeenCalledWith(
      'InfoOS',
      { visitaId: 'visita1' }
    );
  });

  it('mostra mensagem de lista vazia se não houver visitas', () => {
    render(<RawListOSScreen visitas={[]} {...mockNavigationProps} />);

    expect(screen.getByText('Nenhuma visita agendada.')).toBeTruthy();
  });
});
