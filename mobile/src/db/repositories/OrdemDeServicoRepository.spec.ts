import { findOrdemDeServicoById } from './OrdemDeServicoRepository';

const mockFind = jest.fn();
const mockCollection = { find: mockFind };

jest.mock('../../db', () => ({
  database: {
    get: jest.fn(() => mockCollection),
  },
}));

describe('OrdemDeServicoRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar a OS quando encontrada', async () => {
    const mockOS = { id: '123', numeroOs: 'OS-TESTE' };
    mockFind.mockResolvedValue(mockOS);

    const result = await findOrdemDeServicoById('123');

    expect(mockFind).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockOS);
  });

  it('deve retornar null quando falhar ao buscar OS', async () => {
    mockFind.mockRejectedValue(new Error('Registro não encontrado'));

    const result = await findOrdemDeServicoById('id-invalido');

    expect(result).toBeNull();
  });
});
