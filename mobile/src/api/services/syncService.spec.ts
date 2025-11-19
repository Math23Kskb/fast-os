import { synchronize } from '@nozbe/watermelondb/sync';
import apiClient from '../apiClient';
import { sync } from './syncService';

jest.mock('@nozbe/watermelondb/sync');
jest.mock('../apiClient');

const mockedSynchronize = synchronize as jest.Mock;
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('syncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar a função synchronize do WatermelonDB', async () => {
    mockedSynchronize.mockResolvedValue(undefined);
    await sync();
    expect(mockedSynchronize).toHaveBeenCalled();
  });

  it('pullChanges deve chamar o apiClient.get e processar a resposta com sucesso', async () => {
    const mockApiResponse = {
      status: 200, // <-- Adicione o status
      data: {
        changes: {
          // Adicione dados de exemplo para o teste ser mais robusto
          ordensDeServico: { created: [{ id: 'os1', numero_os: '123' }] },
        },
        timestamp: 12345,
      },
    };
    (mockedApiClient.get as jest.Mock).mockResolvedValue(mockApiResponse);

    await sync();

    expect(mockedSynchronize).toHaveBeenCalled();

    const syncConfig = mockedSynchronize.mock.calls[0][0];

    await syncConfig.pullChanges({ lastPulledAt: 1000 });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/sync', {
      params: { last_pulled_at: 1000 },
    });
  });

  it('pullChanges deve lançar um erro se a API falhar', async () => {
    (mockedApiClient.get as jest.Mock).mockRejectedValue(
      new Error('Network Error')
    );

    await sync();

    expect(mockedSynchronize).toHaveBeenCalled();
    const syncConfig = mockedSynchronize.mock.calls[0][0];

    await expect(
      syncConfig.pullChanges({ lastPulledAt: 1000 })
    ).rejects.toThrow('Network Error');
  });

  it('pushChanges deve chamar o apiClient.post com as mudanças corretas', async () => {
    const mockChanges = {
      ordens_de_servico: {
        created: [],
        updated: [{ id: 'os1', status: 'CONCLUÍDA' }],
        deleted: [],
      },
    };
    (mockedApiClient.post as jest.Mock).mockResolvedValue({ status: 200 });

    await sync();

    const syncConfig = mockedSynchronize.mock.calls[0][0];

    await syncConfig.pushChanges({ changes: mockChanges, lastPulledAt: 12345 });

    expect(mockedApiClient.post).toHaveBeenCalledWith('/sync', mockChanges);
  });
});
