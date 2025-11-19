// services/EtapasService.ts
export type EtapaKey =
  | 'saidaEmpresa'
  | 'chegadaCliente'
  | 'saidaCliente'
  | 'chegadaEmpresa';

export interface EtapasData {
  saidaEmpresa?: { horario: string; imagem?: string };
  chegadaCliente?: { horario: string; imagem?: string };
  saidaCliente?: { horario: string; imagem?: string };
  chegadaEmpresa?: { horario: string; imagem?: string };
}

export class EtapasService {
  private etapas: EtapasData = {};

  async getEtapas(): Promise<EtapasData> {
    return this.etapas;
  }

  async atualizarEtapa(
    key: EtapaKey,
    horario: string,
    imagem?: string
  ): Promise<void> {
    this.etapas[key] = { horario, imagem };
  }

  static getProximaEtapa(etapas: EtapasData): EtapaKey | null {
    const ordem: EtapaKey[] = [
      'saidaEmpresa',
      'chegadaCliente',
      'saidaCliente',
      'chegadaEmpresa',
    ];

    return ordem.find((k) => !etapas[k]) ?? null;
  }
}
