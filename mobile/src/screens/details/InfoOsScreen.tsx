import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { of, combineLatest } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { database } from '../../db';
import Visita from '../../db/models/Visita';
import OrdemDeServico from '../../db/models/OrdemDeServico';
import Endereco from '../../db/models/Endereco';
import Tecnico from '../../db/models/Tecnico';
import { AppStackParamList } from '../../types/navigation';

type NavProps = NativeStackScreenProps<AppStackParamList, 'InfoOS'>;

interface DatabaseProps {
  visita: Visita | null;
  ordens: OrdemDeServico[];
  endereco?: Endereco | null;
  tecnico?: Tecnico | null;
}
type Props = NavProps & DatabaseProps;

export const RawInfoOSScreen = ({
  visita,
  ordens,
  endereco,
  tecnico,
  navigation,
}: Props) => {
  const [activeTab, setActiveTab] = React.useState<'GERAL' | 'OS'>('GERAL');

  const [nomeCliente, setNomeCliente] = React.useState('Carregando...');

  React.useEffect(() => {
    if (!visita || ordens.length === 0) return;

    const todasConcluidas = ordens.every((os) => os.status === 'CONCLUIDA');

    if (todasConcluidas && visita.status !== 'CONCLUIDA') {
      database.action(async () => {
        try {
          visita.update((v) => {
            v.status = 'CONCLUIDA';
          });
        } catch (e) {
          console.log('Erro ao atualizar visita:', e);
        }
      });
    }
  }, [ordens, visita]);

  React.useEffect(() => {
    const loadCliente = async () => {
      if (ordens.length > 0) {
        // Check if client exists before fetching to be safe
        const cli = await ordens[0].cliente.fetch();
        setNomeCliente(cli?.nome || 'N/A');
      } else {
        setNomeCliente('Sem OS vinculada');
      }
    };
    loadCliente();
  }, [ordens]);

  if (!visita) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 50, color: 'red' }}>Erro: ID inválido.</Text>
        <TouchableOpacity
          style={styles.b_voltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleIrParaEtapas = () => {
    navigation.navigate('RegistroEtapa', { visitaId: visita.id });
  };

  const renderGeralTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Dados do Cliente</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{nomeCliente}</Text>
        {/* Outros dados do cliente poderiam vir aqui */}
      </View>

      <Text style={styles.sectionTitle}>Localização</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>
          {endereco
            ? `${endereco.logradouro}, ${endereco.numero}`
            : 'Endereço não encontrado'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Técnico Responsável</Text>
      <View style={styles.card}>
        <Text style={styles.value}>{tecnico?.nome || 'Não atribuído'}</Text>
      </View>
    </View>
  );

  const renderOSTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>
        Ordens de Serviço ({ordens.length})
      </Text>

      {ordens.map((os) => {
        const problema =
          Array.isArray(os.problemaDetalhado) && os.problemaDetalhado.length > 0
            ? os.problemaDetalhado[0]
            : null;

        return (
          <View key={os.id} style={styles.osCard}>
            {/* Cabeçalho */}
            <View style={styles.osHeader}>
              <Text style={styles.osTitle}>
                OS #{os.numeroOs || '-- N/A --'}
              </Text>
              <Text
                style={[
                  styles.osStatus,
                  { color: os.status === 'CONCLUIDA' ? 'green' : '#e67e22' },
                ]}
              >
                {os.status || '-- N/A --'}
              </Text>
            </View>

            {/* Datas */}
            <View style={styles.osSection}>
              <Text style={styles.osInfo}>
                <Text style={styles.osLabel}>Início:</Text>{' '}
                {os.dataInicioExecucao
                  ? new Date(os.dataInicioExecucao).toLocaleString()
                  : '-- N/A --'}
              </Text>

              <Text style={styles.osInfo}>
                <Text style={styles.osLabel}>Fim:</Text>{' '}
                {os.dataFimExecucao
                  ? new Date(os.dataFimExecucao).toLocaleString()
                  : '-- N/A --'}
              </Text>
            </View>

            {/* Problema detalhado */}
            <View style={styles.osSection}>
              <Text style={styles.osLabel}>Problema detalhado:</Text>
              <Text style={styles.osText}>
                {problema?.categoria ||
                  problema?.titulo ||
                  problema?.descricao ||
                  '-- N/A --'}
              </Text>

              {problema?.descricao ? (
                <Text style={styles.osText}>{problema.descricao}</Text>
              ) : null}
            </View>

            {/* Diagnóstico Técnico */}
            <View style={styles.osSection}>
              <Text style={styles.osLabel}>Diagnóstico técnico:</Text>
              <Text style={styles.osText}>
                {os.diagnosticoTecnico || '-- N/A --'}
              </Text>
            </View>

            {/* Solução Aplicada */}
            <View style={styles.osSection}>
              <Text style={styles.osLabel}>Solução aplicada:</Text>
              <Text style={styles.osText}>
                {os.solucaoAplicada || '-- N/A --'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conferência da Visita</Text>
        <Text style={styles.headerSubtitle}>Status: {visita.status}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'GERAL' && styles.tabActive]}
          onPress={() => setActiveTab('GERAL')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'GERAL' && styles.tabTextActive,
            ]}
          >
            Geral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'OS' && styles.tabActive]}
          onPress={() => setActiveTab('OS')}
        >
          <Text
            style={[styles.tabText, activeTab === 'OS' && styles.tabTextActive]}
          >
            Ordens ({ordens.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
      >
        {activeTab === 'GERAL' ? renderGeralTab() : renderOSTab()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleIrParaEtapas}
        >
          <Text style={styles.actionButtonText}>
            Iniciar Deslocamento / Etapas →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const enhance = withObservables(['route'], ({ route }) => {
  if (!route?.params?.visitaId) {
    return {
      visita: of(null),
      ordens: of([]),
      endereco: of(null),
      tecnico: of(null),
    };
  }

  const visitaObservable = database.collections
    .get<Visita>('visitas')
    .findAndObserve(route.params.visitaId);

  return {
    visita: visitaObservable,

    ordens: visitaObservable.pipe(
      switchMap((visita) =>
        visita
          ? visita.ordens.observe().pipe(
              switchMap((ordens) => {
                return ordens.length
                  ? combineLatest(ordens.map((os) => os.observe()))
                  : of([]);
              })
            )
          : of([])
      )
    ),

    endereco: visitaObservable.pipe(
      switchMap((visita) => (visita ? visita.endereco.observe() : of(null)))
    ),

    tecnico: visitaObservable.pipe(
      switchMap((visita) => {
        if (!visita?.tecnicoId) return of(null);

        return database
          .get<Tecnico>('tecnicos')
          .findAndObserve(visita.tecnicoId)
          .pipe(
            map((t) => t ?? null),
            catchError(() => of(null))
          );
      })
    ),
  };
});

export default enhance(RawInfoOSScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  headerSubtitle: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#3498db' },
  tabText: { fontSize: 16, color: '#95a5a6', fontWeight: '600' },
  tabTextActive: { color: '#3498db' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  tabContent: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#95a5a6',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },
  label: { fontSize: 12, color: '#7f8c8d', marginBottom: 2 },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
    fontWeight: '500',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  osCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e67e22',
    elevation: 1,
  },
  osHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  osTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  osStatus: { fontSize: 12, fontWeight: 'bold', color: '#e67e22' },
  osProblem: { fontSize: 14, color: '#7f8c8d' },
  actionButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  b_voltar: {
    backgroundColor: '#bdc3c7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  osInfo: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 2,
  },
  osLabel: {
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  osText: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 2,
    lineHeight: 20,
  },
  osSection: {
    marginBottom: 15,
  },
  footer: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
