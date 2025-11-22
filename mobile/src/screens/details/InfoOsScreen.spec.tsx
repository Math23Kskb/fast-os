import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { RawInfoOSScreen } from './InfoOsScreen';
import Visita from '../../db/models/Visita';
import OrdemDeServico from '../../db/models/OrdemDeServico';

jest.mock('../../db', () => ({
  database: {
    action: jest.fn((callback) => callback()),
    collections: {
      get: jest.fn(() => ({
        findAndObserve: jest.fn(),
        create: jest.fn(),
      })),
    },
  },
}));

// --- MOCKS ---
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const mockRoute = { params: { visitaId: 'visita-1' } } as any;

// Dados simulados
const mockEnderecoData = {
  id: 'end-1',
  logradouro: 'Rua Teste',
  numero: '123',
  cidade: 'SP',
  estado: 'SP',
  bairro: 'Centro',
};
const mockTecnicoData = {
  id: 'tec-1',
  nome: 'Técnico João',
  matricula: '1234',
};
const mockClienteData = {
  nome: 'Cliente Teste',
  contato: 'Sr. Teste',
  telefone: '1199999999',
};

const mockVisita = {
  id: 'visita-1',
  status: 'AGENDADA',
  endereco: { fetch: jest.fn().mockResolvedValue(mockEnderecoData) },
  tecnico: { fetch: jest.fn().mockResolvedValue(mockTecnicoData) },
} as unknown as Visita;

const mockVisitaSemDados = {
  id: 'visita-2',
  status: 'AGENDADA',
  endereco: { fetch: jest.fn().mockResolvedValue(null) },
  tecnico: { fetch: jest.fn().mockResolvedValue(null) },
} as unknown as Visita;

const mockOS = {
  id: 'os-1',
  numeroOs: '999',
  status: 'ABERTA',
  cliente: {
    fetch: jest.fn().mockResolvedValue(mockClienteData),
  },
  problemaDetalhado: null,
} as unknown as OrdemDeServico;

describe('InfoOSScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza erro e botão de voltar se a visita não existir', () => {
    render(
      <RawInfoOSScreen
        visita={null}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    expect(screen.getByText('Erro: ID inválido.')).toBeTruthy();

    const btnVoltar = screen.getByText('Voltar');
    fireEvent.press(btnVoltar);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('renderiza dados completos (visita, endereço, técnico, cliente)', async () => {
    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
        endereco={mockEnderecoData as any}
        tecnico={mockTecnicoData as any}
      />
    );

    expect(await screen.findByText('Cliente Teste')).toBeTruthy();

    expect(await screen.findByText(/Rua Teste/)).toBeTruthy();
    expect(await screen.findByText('Técnico João')).toBeTruthy();
  });

  it('trata caso onde Endereço e Técnico não são encontrados (Branch Coverage)', async () => {
    render(
      <RawInfoOSScreen
        visita={mockVisitaSemDados}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    expect(await screen.findByText('Cliente Teste')).toBeTruthy();

    expect(screen.getByText('Conferência da Visita')).toBeTruthy();
  });

  it('trata caso onde não há OS vinculada (Branch Coverage do else)', async () => {
    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[]} // Lista vazia
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    const fallbackText = await screen.findByText('Sem OS vinculada');
    expect(fallbackText).toBeTruthy();
  });

  it('renderiza lista de OSs ao trocar para a aba ORDENS', async () => {
    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    await screen.findByText('Cliente Teste');

    fireEvent.press(screen.getByText(/Ordens/));

    expect(screen.getByText('OS #999')).toBeTruthy();
  });

  it('navega para registro de etapas ao clicar no botão', async () => {
    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    await screen.findByText('Cliente Teste');

    const button = screen.getByText(/Iniciar Deslocamento/i);
    fireEvent.press(button);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RegistroEtapa', {
      visitaId: 'visita-1',
    });
  });

  it('renderiza detalhes completos da OS (datas, diagnóstico, solução) na aba ORDENS', async () => {
    const mockOSCompleta = {
      ...mockOS,
      id: 'os-full',
      numeroOs: '1001',
      status: 'CONCLUIDA',
      dataInicioExecucao: '2023-11-21T10:00:00.000Z',
      dataFimExecucao: '2023-11-21T12:00:00.000Z',
      diagnosticoTecnico: 'Cabo rompido',
      solucaoAplicada: 'Troca de cabeamento',
      problemaDetalhado: [
        {
          titulo: 'Falha de Conexão',
          descricao: 'Internet lenta e caindo',
        },
      ],
    } as unknown as OrdemDeServico;

    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[mockOSCompleta]}
        navigation={mockNavigation}
        route={mockRoute}
        endereco={mockEnderecoData as any}
        tecnico={mockTecnicoData as any}
      />
    );

    const tabOrdens = screen.getByText(/Ordens/);
    fireEvent.press(tabOrdens);

    expect(await screen.findByText('OS #1001')).toBeTruthy();
    expect(screen.getByText('Cabo rompido')).toBeTruthy();
    expect(screen.getByText('Troca de cabeamento')).toBeTruthy();
    expect(screen.getByText('Internet lenta e caindo')).toBeTruthy();

    const nAs = screen.queryAllByText('-- N/A --');
    expect(nAs.length).toBe(0);
  });

  it('renderiza placeholders (-- N/A --) quando a OS tem dados vazios', async () => {
    const mockOSVazia = {
      ...mockOS,
      id: 'os-empty',
      numeroOs: null,
      status: null,
      dataInicioExecucao: null,
      dataFimExecucao: null,
      diagnosticoTecnico: null,
      solucaoAplicada: null,
      problemaDetalhado: [],
    } as unknown as OrdemDeServico;

    render(
      <RawInfoOSScreen
        visita={mockVisita}
        ordens={[mockOSVazia]}
        navigation={mockNavigation}
        route={mockRoute}
        endereco={mockEnderecoData as any}
        tecnico={mockTecnicoData as any}
      />
    );

    const tabOrdens = screen.getByText(/Ordens/);
    fireEvent.press(tabOrdens);

    expect(screen.getByText('OS #-- N/A --')).toBeTruthy();

    const placeholders = screen.getAllByText('-- N/A --');

    expect(placeholders.length).toBeGreaterThanOrEqual(4);
  });
});
