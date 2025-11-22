import React from 'react';
import { Alert, TouchableOpacity, Text } from 'react-native';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react-native';
import { RawDefectFormScreen } from './DefectFormScreen';
import OrdemDeServico from '../../db/models/OrdemDeServico';

// --- MOCKS ---
const mockLaunchCamera = jest.fn(() =>
  Promise.resolve({ canceled: false, assets: [{ uri: 'test-uri' }] })
);
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchCameraAsync: () => mockLaunchCamera(),
}));

const mockUpdate = jest.fn();
const mockCreate = jest.fn();
const mockCollection = { create: mockCreate };

jest.mock('../../db', () => ({
  database: {
    write: jest.fn(async (action) => await action()),
    collections: { get: jest.fn(() => mockCollection) },
  },
}));

jest.mock('react-native-element-dropdown', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    MultiSelect: ({ onChange, data, placeholder }: any) => (
      <TouchableOpacity
        testID="multi-select"
        // Simula selecionar 'OUTROS' se disponível, senão o primeiro
        onPress={() => {
          const outrosItem = data.find((d: any) => d.value === 'OUTROS');
          onChange([outrosItem ? 'OUTROS' : data[0].value]);
        }}
        accessibilityLabel={placeholder}
      >
        <Text>Mock Dropdown</Text>
      </TouchableOpacity>
    ),
  };
});

jest.spyOn(Alert, 'alert');

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const mockRoute = { params: { osId: 'os-1' } } as any;

const mockOSIniciada = {
  id: 'os-1',
  numeroOs: '12345',
  status: 'EM_ANDAMENTO',
  dataInicioExecucao: new Date(),
  dataFimExecucao: null,
  problemaDetalhado: null,
  diagnosticoTecnico: '',
  solucaoAplicada: '',
  update: mockUpdate,
} as unknown as OrdemDeServico;

const mockOSAberta = {
  ...mockOSIniciada,
  status: 'AGENDADA',
  dataInicioExecucao: null,
} as unknown as OrdemDeServico;
// const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {/* mock */});

describe('DefectFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia o atendimento', async () => {
    render(
      <RawDefectFormScreen
        os={mockOSAberta}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );
    await act(async () => {
      fireEvent.press(screen.getByText('▶ INICIAR ATENDIMENTO'));
    });
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('adiciona e remove foto', async () => {
    render(
      <RawDefectFormScreen
        os={mockOSIniciada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // 1. Abre a categoria para ver os botões
    fireEvent.press(screen.getByText('Refrigeração'));

    // 2. Adiciona foto
    await act(async () => {
      fireEvent.press(screen.getByText('📷 Foto (Refrigeração)'));
    });
    expect(mockLaunchCamera).toHaveBeenCalled();

    // 3. Verifica se o botão de remover apareceu ("X")
    const removeBtn = await screen.findByText('X');
    expect(removeBtn).toBeTruthy();

    // 4. Remove a foto
    fireEvent.press(removeBtn);
    expect(screen.queryByText('X')).toBeNull();
  });

  it('exibe input "Outro" quando selecionado no dropdown', async () => {
    render(
      <RawDefectFormScreen
        os={mockOSIniciada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // 1. Abre a categoria
    fireEvent.press(screen.getByText('Refrigeração'));

    // 2. Clica no Dropdown
    fireEvent.press(screen.getByTestId('multi-select'));

    // 3. Verifica input condicional
    const inputOutro = await screen.findByPlaceholderText(
      'Descreva o defeito...'
    );
    expect(inputOutro).toBeTruthy();

    fireEvent.changeText(inputOutro, 'Defeito estranho');
  });

  it('bloqueia salvar se faltar diagnóstico ou solução', async () => {
    render(
      <RawDefectFormScreen
        os={mockOSIniciada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // 1. Abre Categoria e Seleciona defeito (para passar da primeira validação)
    fireEvent.press(screen.getByText('Refrigeração'));
    fireEvent.press(screen.getByTestId('multi-select'));

    // 2. Tenta finalizar sem preencher textos
    fireEvent.press(screen.getByText('FINALIZAR ATENDIMENTO'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Atenção',
      expect.stringContaining('Preencha o Diagnóstico')
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('trata erro ao salvar no banco', async () => {
    // Força erro
    mockUpdate.mockRejectedValueOnce(new Error('Erro Banco'));

    render(
      <RawDefectFormScreen
        os={mockOSIniciada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // 1. Abre Categoria
    fireEvent.press(screen.getByText('Refrigeração'));

    // 2. Preenche tudo
    fireEvent.press(screen.getByTestId('multi-select'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Explique o que causou o problema...'),
      'Ok'
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Descreva o serviço realizado...'),
      'Ok'
    );

    await act(async () => {
      fireEvent.press(screen.getByText('FINALIZAR ATENDIMENTO'));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
  });

  it('renderiza estado de finalizado', () => {
    const osFinalizada = {
      ...mockOSIniciada,
      dataFimExecucao: new Date(),
      status: 'CONCLUIDA',
    } as unknown as OrdemDeServico;
    render(
      <RawDefectFormScreen
        os={osFinalizada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    expect(screen.getByText('✅ Atendimento Finalizado')).toBeTruthy();
  });

  it('salva formulário incluindo fotos anexadas', async () => {
    render(
      <RawDefectFormScreen
        os={mockOSIniciada}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // 1. Seleciona Categoria e Defeito
    fireEvent.press(screen.getByText('Refrigeração'));
    // Mock do dropdown seleciona o primeiro item
    fireEvent.press(screen.getByTestId('multi-select'));

    // 2. Preenche textos
    fireEvent.changeText(
      screen.getByPlaceholderText('Explique o que causou o problema...'),
      'Diagnóstico foto'
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Descreva o serviço realizado...'),
      'Solução foto'
    );

    // 3. Adiciona FOTO
    await act(async () => {
      fireEvent.press(screen.getByText('📷 Foto (Refrigeração)'));
    });

    await waitFor(() => {
      expect(screen.getByText('X')).toBeTruthy();
    });

    // 4. Finaliza
    await act(async () => {
      fireEvent.press(screen.getByText('FINALIZAR ATENDIMENTO'));
    });

    expect(mockUpdate).toHaveBeenCalled();

    // 5. VALIDAÇÃO DA CRIAÇÃO DO ANEXO
    expect(mockCreate).toHaveBeenCalled();

    // Captura o callback passado para o create
    const createCallback = mockCreate.mock.calls[0][0];
    const anexoSimulado: any = {};
    createCallback(anexoSimulado); // Executa o callback para preencher o objeto

    // Verifica os dados no objeto preenchido
    expect(anexoSimulado).toEqual(
      expect.objectContaining({
        urlArquivo: 'test-uri',
        tipoArquivo: 'FOTO',
        etapa: 'EXECUCAO',
        descricao: expect.stringContaining('Categoria: Refrigeração'),
      })
    );
  });
});
