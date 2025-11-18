import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { NavProps, RawListOSScreen } from './ListOSScreen';
import OrdemDeServico from '../../db/models/OrdemDeServico';

const mockOrdens = [
  { id: 'os1', numeroOs: '1001', status: 'AGENDADA' },
  { id: 'os2', numeroOs: '1002', status: 'EM ANDAMENTO' },
  { id: 'os3', numeroOs: '1003', status: 'CONCLUÍDA' },
] as OrdemDeServico[];

const mockNavigationProps: NavProps = {
  navigation: {
    navigate: jest.fn(),
  } as any,
  route: {
    key: 'ListOS-key',
    name: 'ListOS',
  } as any,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('<ListOSScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os itens da lista corretamente', async () => {
    render(<RawListOSScreen ordens={mockOrdens} {...mockNavigationProps} />);

    expect(screen.getByText('OS: 1001')).toBeTruthy();
    expect(screen.getByText('OS: 1002')).toBeTruthy();
    expect(screen.getByText('Selecione uma OS')).toBeTruthy();
  });

  it('seleciona e desseleciona com toque simples', async () => {
    render(<RawListOSScreen ordens={mockOrdens} {...mockNavigationProps} />);
    const item1 = screen.getByText('OS: 1001');

    fireEvent.press(item1);

    expect(screen.getByText('Visualizar (1)')).toBeTruthy();

    fireEvent.press(item1);
    expect(screen.getByText('Selecione uma OS')).toBeTruthy();
  });

  it('ativa o modo multiseleção com toque longo', async () => {
    render(<RawListOSScreen ordens={mockOrdens} {...mockNavigationProps} />);
    const item1 = screen.getByText('OS: 1001');
    const item2 = screen.getByText('OS: 1002');

    fireEvent(item1, 'longPress');
    expect(screen.getByText('1 selecionado(s)')).toBeTruthy();

    fireEvent.press(item2);
    expect(screen.getByText('2 selecionado(s)')).toBeTruthy();
    expect(screen.getByText('Visualizar (2)')).toBeTruthy();
  });

  it('executa handleButtonPress e loga as OSs selecionadas', async () => {
    render(<RawListOSScreen ordens={mockOrdens} {...mockNavigationProps} />);

    fireEvent.press(screen.getByText('OS: 1001'));
    fireEvent.press(screen.getByText('Visualizar (1)'));

    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Navegaria para outra tela com os IDs:',
      ['os1']
    );

    expect(mockNavigationProps.navigation.navigate).not.toHaveBeenCalled();
  });
});
