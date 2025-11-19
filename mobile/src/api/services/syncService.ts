import { database } from '../../db';
import apiClient from '../apiClient';
import { synchronize } from '@nozbe/watermelondb/sync';

export async function sync() {
  console.log('🔬 [SYNC] Processo de sincronização INICIADO.');

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      console.log(
        `📡 [SYNC PULL] Puxando mudanças do servidor desde: ${
          lastPulledAt || 'o início'
        }`
      );
      try {
        const response = await apiClient.get('/sync', {
          params: {
            last_pulled_at: lastPulledAt,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Servidor retornou status ${response.status}`);
        }

        const { changes: rawChanges, timestamp } = response.data;

        if (!rawChanges) {
          throw new Error(
            "A resposta da API de sync não continha a chave 'changes'."
          );
        }

        const changes = {
          visitas: rawChanges.visitas,
          clientes: rawChanges.clientes,
          enderecos: rawChanges.enderecos,
          tecnicos: rawChanges.tecnicos,
          ordens_de_servico: rawChanges.ordensDeServico,
          anexos: rawChanges.anexos,
        };

        console.log(
          '📦 [SYNC PULL] Dados recebidos do backend:',
          JSON.stringify(changes, null, 2)
        );

        console.log(
          '✅ [SYNC PULL] Puxada concluída com sucesso. Entregando dados para o WatermelonDB escrever...'
        );

        return { changes, timestamp };
      } catch (error) {
        console.error('❌ [SYNC PULL] Falha ao puxar dados:', error);
        throw error;
      }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('📤 [SYNC PUSH] Enviando mudanças locais para o servidor...');
      try {
        await apiClient.post('/sync', changes);
        console.log('✅ [SYNC PUSH] Envio concluído com sucesso.');
      } catch (error) {
        console.error('❌ [SYNC PUSH] Falha ao enviar dados:', error);
        throw error;
      }
    },
  });
  console.log('🏁 [SYNC] Processo de sincronização FINALIZADO.');
}
