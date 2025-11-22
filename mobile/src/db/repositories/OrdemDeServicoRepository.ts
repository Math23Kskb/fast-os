import { database } from '..';
import OrdemDeServico from '../models/OrdemDeServico';

export const findOrdemDeServicoById = async (
  osId: string
): Promise<OrdemDeServico | null> => {
  try {
    const os = await database
      .get<OrdemDeServico>('ordens_de_servico')
      .find(osId);
    return os;
  } catch (error) {
    return null;
  }
};
