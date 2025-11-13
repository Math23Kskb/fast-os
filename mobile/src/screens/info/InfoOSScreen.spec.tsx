import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { InfoOSScreen } from './InfoOSScreen';

// Mock do Header
jest.mock('../../componets/Header', () => ({
  Header: () => <></>,
}));

// Mock global do fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        osn: '12345',
        data: '01/01/2025',
        cliente: 'Victor',
        contato: 'João',
        telefone: '99999-9999',
        endereco: 'Rua Teste',
        bairro: 'Centro',
        cidade: 'Londrina',
        codigo: 'C-001',
        pedido: 'PED-444',
        dataFat: '02/01/2025',
        garantia: '12 meses',
        tecnico: 'Carlos',
        email: 'carlos@test.com',
        empresa: 'Tech Ltda',
        cidadeTecnico: 'Maringá',
        telefoneTecnico: '88888-8888',
        nserie: 'SN-2222',
        tipo: 'Manutenção',
        obs: 'Equipamento travando',
      }),
  })
) as jest.Mock;

describe('InfoOSScreen', () => {
  it('deve renderizar corretamente e exibir os dados da API', async () => {
    const { getByText } = render(<InfoOSScreen />);

    // Espera a atualização do fetch
    await waitFor(() => {
      expect(getByText('Informação do OS')).toBeTruthy();
    });

    // Verifica se os dados mockados aparecem
    expect(getByText('OS.N: 12345')).toBeTruthy();
    expect(getByText('Data: 01/01/2025')).toBeTruthy();
    expect(getByText('Cliente: Victor')).toBeTruthy();
    expect(getByText('Contato: João')).toBeTruthy();
    expect(getByText('Tell: 99999-9999')).toBeTruthy();
    expect(getByText('Endereço: Rua Teste')).toBeTruthy();
    expect(getByText('Bairro: Centro')).toBeTruthy();
    expect(getByText('Cidade: Londrina')).toBeTruthy();
    expect(getByText('Código do Cliente: C-001')).toBeTruthy();
    expect(getByText('Pedido: PED-444')).toBeTruthy();
    expect(getByText('Garantia: 12 meses')).toBeTruthy();

    // Dados do técnico
    expect(getByText('Nome: Carlos')).toBeTruthy();
    expect(getByText('Email: carlos@test.com')).toBeTruthy();

    // Descrição
    expect(getByText('N.Series: SN-2222')).toBeTruthy();
    expect(getByText('Tipo: Manutenção')).toBeTruthy();
    expect(getByText('Observação: Equipamento travando')).toBeTruthy();
  });

  it('deve renderizar os botões Cancelar e Iniciar', async () => {
    const { getByText } = render(<InfoOSScreen />);

    await waitFor(() => {
      expect(getByText('Cancelar')).toBeTruthy();
      expect(getByText('Iniciar')).toBeTruthy();
    });
  });
});
