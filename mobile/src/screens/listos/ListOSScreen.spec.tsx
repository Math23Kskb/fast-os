import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { ListOSScreen } from './ListOSScreen';

jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('<ListOSScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os elementos principais da tela', async () => {
    render(<ListOSScreen />);

    await screen.findByText('Cliente A');

    expect(screen.getByText(/Ordens de Serviço/i)).toBeTruthy();
    expect(screen.getByText('Selecione uma OS')).toBeTruthy();
  });

  it('seleciona uma OS com toque simples', async () => {
    render(<ListOSScreen />);

    await screen.findByText('Cliente A');

    const item = screen.getByText('Cliente A');

    fireEvent.press(item);

    expect(screen.getByText('Visualizar')).toBeTruthy();
  });

  it('ativa o modo multiseleção com toque longo e seleciona vários itens', async () => {
    render(<ListOSScreen />);

    await screen.findByText('Cliente A');

    const item1 = screen.getByText('Cliente A');
    const item2 = screen.getByText('Cliente B');

    fireEvent(item1, 'longPress');
    expect(screen.getByText('1 selecionado(s)')).toBeTruthy();

    fireEvent.press(item2);
    expect(screen.getByText('2 selecionado(s)')).toBeTruthy();
    expect(screen.getByText('Visualizar')).toBeTruthy();
  });

  it('remove item da seleção ao tocar novamente no modo simples', async () => {
    render(<ListOSScreen />);

    await screen.findByText('Cliente A');

    const item1 = screen.getByText('Cliente A');

    fireEvent.press(item1);
    expect(screen.getByText('Visualizar')).toBeTruthy();

    fireEvent.press(item1);
    expect(screen.queryByText('Visualizar')).toBeNull();
    expect(screen.getByText('Selecione uma OS')).toBeTruthy();
  });

  it('executa handleButtonPress e loga as OSs selecionadas', async () => {
    render(<ListOSScreen />);

    await screen.findByText('Cliente A');

    const itemA = screen.getByText('Cliente A');

    fireEvent.press(itemA);

    const button = screen.getByText('Visualizar');

    fireEvent.press(button);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(JSON.stringify({ ids: ['1'] }));
    });
  });
});
