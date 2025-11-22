import React from 'react';
import { Alert } from 'react-native';
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react-native';
import { RawRegistroEtapaScreen } from './RegistroEtapaScreen';
import Visita from '../../db/models/Visita';
import OrdemDeServico from '../../db/models/OrdemDeServico';

// --- MOCKS ---
const mockRequestPerm = jest.fn();
const mockLaunchCamera = jest.fn();

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: () => mockRequestPerm(),
  launchCameraAsync: () => mockLaunchCamera(),
}));

const mockUpdate = jest.fn();
const mockCreate = jest.fn();
const mockCollection = { create: mockCreate };

jest.mock('../../db', () => ({
  database: {
    write: jest.fn(async (action) => await action()),
    collections: {
      get: jest.fn(() => mockCollection),
    },
  },
}));

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const mockRoute = { params: { visitaId: 'visita-1' } } as any;
const alertSpy = jest.spyOn(Alert, 'alert');

jest.spyOn(console, 'error').mockImplementation(() => {
  /* mock */
});

const mockVisitaBase = {
  id: 'visita-1',
  status: 'AGENDADA',
  dataSaidaEmpresa: null,
  dataChegadaCliente: null,
  dataSaidaCliente: null,
  dataChegadaEmpresa: null,
  update: mockUpdate,
} as unknown as Visita;

const mockOS = {
  id: 'os-1',
  numeroOs: '123',
  status: 'ABERTA',
} as unknown as OrdemDeServico;

describe('RegistroEtapaScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPerm.mockResolvedValue({ status: 'granted', granted: true });
    mockLaunchCamera.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-uri' }],
    });
    mockUpdate.mockResolvedValue(true);
  });

  it('renderiza erro se a visita for nula', () => {
    render(
      <RawRegistroEtapaScreen
        visita={null}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );
    expect(
      screen.getByText('Erro: Visita não encontrada no banco de dados.')
    ).toBeTruthy();
  });

  it('registra horário da PRIMEIRA etapa e atualiza status para EM_DESLOCAMENTO', async () => {
    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('Registrar Horário'));

    await act(async () => {
      await alertSpy.mock.calls[0][2][1].onPress();
    });

    expect(mockUpdate).toHaveBeenCalled();

    const updateCallback = mockUpdate.mock.calls[0][0];
    const visitaSimulada: any = {};
    updateCallback(visitaSimulada);

    expect(visitaSimulada.status).toBe('EM_DESLOCAMENTO');
    expect(visitaSimulada.dataSaidaEmpresa).toBeDefined();
  });

  it('registra horário da SEGUNDA etapa e atualiza status para EM_ATENDIMENTO', async () => {
    const visitaEmTransito = {
      ...mockVisitaBase,
      dataSaidaEmpresa: new Date(),
    } as unknown as Visita;

    render(
      <RawRegistroEtapaScreen
        visita={visitaEmTransito}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    expect(screen.getByText('Próxima: Chegada no Cliente')).toBeTruthy();

    fireEvent.press(screen.getByText('Registrar Horário'));

    await act(async () => {
      await alertSpy.mock.calls[0][2][1].onPress();
    });

    const updateCallback = mockUpdate.mock.calls[0][0];
    const visitaSimulada: any = {};
    updateCallback(visitaSimulada);

    expect(visitaSimulada.status).toBe('EM_ATENDIMENTO');
  });

  it('renderiza estado de FINALIZADA quando todas as datas estão preenchidas', () => {
    const visitaFinalizada = {
      ...mockVisitaBase,
      dataSaidaEmpresa: new Date(),
      dataChegadaCliente: new Date(),
      dataSaidaCliente: new Date(),
      dataChegadaEmpresa: new Date(),
    } as unknown as Visita;

    render(
      <RawRegistroEtapaScreen
        visita={visitaFinalizada}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    expect(screen.getByText('Visita Finalizada!')).toBeTruthy();
    expect(screen.queryByText('Registrar Horário')).toBeNull();
  });

  it('permite edição manual de horário', async () => {
    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('Registrar Horário'));

    await act(async () => {
      await alertSpy.mock.calls[0][2][0].onPress();
    }); // Editar

    const input = screen.getByDisplayValue(/T/);
    expect(input).toBeTruthy();

    fireEvent.changeText(input, '2025-11-20T10:00:00.000Z');

    await act(async () => {
      fireEvent.press(screen.getByText('Salvar Edição'));
    });

    expect(mockUpdate).toHaveBeenCalled();
  });

  it('trata erro ao salvar no banco de dados', async () => {
    mockUpdate.mockRejectedValueOnce(new Error('Erro DB'));

    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('Registrar Horário'));

    await act(async () => {
      await alertSpy.mock.calls[0][2][1].onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', expect.any(String));
  });

  it('abre a câmera, salva a foto no estado e persiste no banco', async () => {
    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    await act(async () => {
      fireEvent.press(screen.getByText('📷 Foto (Opcional)'));
    });

    await waitFor(() => {
      expect(mockLaunchCamera).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('📷 Foto Anexada')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Registrar Horário'));

    await act(async () => {
      await alertSpy.mock.calls[0][2][1].onPress();
    });

    expect(mockCreate).toHaveBeenCalled();

    const createCallback = mockCreate.mock.calls[0][0];
    const anexoSimulado: any = {};
    createCallback(anexoSimulado);

    expect(anexoSimulado).toEqual(
      expect.objectContaining({
        urlArquivo: 'test-uri',
        tipoArquivo: 'FOTO',
        descricao: expect.stringContaining('Etapa:'),
      })
    );
  });

  it('exibe alerta se permissão de câmera for negada', async () => {
    mockRequestPerm.mockResolvedValueOnce({ status: 'denied', granted: false });

    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    await act(async () => {
      fireEvent.press(screen.getByText('📷 Foto (Opcional)'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permissão necessária',
        expect.any(String)
      );
    });
  });

  it('bloqueia abrir OS se ainda não chegou no cliente', () => {
    render(
      <RawRegistroEtapaScreen
        visita={mockVisitaBase}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('OS #123'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Aguarde',
      expect.stringContaining('Registre a chegada')
    );
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('bloqueia abrir OS se já saiu do cliente', () => {
    const visitaSaiu = {
      ...mockVisitaBase,
      dataSaidaEmpresa: new Date(),
      dataChegadaCliente: new Date(),
      dataSaidaCliente: new Date(),
    } as unknown as Visita;

    render(
      <RawRegistroEtapaScreen
        visita={visitaSaiu}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('OS #123'));
    expect(Alert.alert).toHaveBeenCalledWith('Fechado', expect.any(String));
  });

  it('NAVEGA para DefectForm se estiver no cliente (sucesso)', () => {
    const visitaNoCliente = {
      ...mockVisitaBase,
      dataSaidaEmpresa: new Date(),
      dataChegadaCliente: new Date(),
    } as unknown as Visita;

    render(
      <RawRegistroEtapaScreen
        visita={visitaNoCliente}
        ordens={[mockOS]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    fireEvent.press(screen.getByText('OS #123'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DefectForm', {
      osId: 'os-1',
    });
  });

  it('exibe bloqueio visual (botão desabilitado) se tentar sair com pendência', () => {
    const visitaNoCliente = {
      ...mockVisitaBase,
      dataSaidaEmpresa: new Date(),
      dataChegadaCliente: new Date(),
    } as unknown as Visita;
    const osPendente = {
      ...mockOS,
      status: 'EM_ANDAMENTO',
    } as unknown as OrdemDeServico;

    render(
      <RawRegistroEtapaScreen
        visita={visitaNoCliente}
        ordens={[osPendente]}
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    const btnRegistrar = screen.getByText('Registrar Horário');
    fireEvent.press(btnRegistrar);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Você deve concluir ou cancelar todas as OSs/i)
    ).toBeTruthy();
  });
});
