import { EtapasService } from './EtapasService';

describe('EtapasService', () => {
  it('identifica corretamente a próxima etapa vazia', async () => {
    const service = new EtapasService();

    await service.atualizarEtapa('saidaEmpresa', '2024-01-01T10:00:00Z');

    const etapas = await service.getEtapas();
    const proxima = EtapasService.getProximaEtapa(etapas);

    expect(proxima).toBe('chegadaCliente');
  });
});
