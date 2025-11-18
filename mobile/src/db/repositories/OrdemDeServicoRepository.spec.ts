import { database } from '..';
import { findOrdemDeServicoById } from './OrdemDeServicoRepository';

jest.mock('..');

const mockedDatabase = database as jest.Mocked<typeof database>;

describe('OrdemDeServicoRepository', () => {
  it('findOrdemDeServicoById deve chamar o método find do WatermelonDB', async () => {
    const mockFind = jest
      .fn()
      .mockResolvedValue({ id: 'os1', numeroOs: '123' });
    mockedDatabase.get.mockReturnValue({
      find: mockFind,
    } as any);

    const osId = 'os1';
    await findOrdemDeServicoById(osId);

    expect(mockedDatabase.get).toHaveBeenCalledWith('ordens_de_servico');

    expect(mockFind).toHaveBeenCalledWith(osId);
  });

  it('findOrdemDeServicoById deve retornar null se o registro não for encontrado', async () => {
    const mockFind = jest.fn().mockRejectedValue(new Error('Record not found'));
    mockedDatabase.get.mockReturnValue({
      find: mockFind,
    } as any);

    const os = await findOrdemDeServicoById('id-nao-existe');

    expect(os).toBeNull();
  });
});
