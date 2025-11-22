import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { withObservables } from '@nozbe/watermelondb/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { database } from '../../db';
import Visita from '../../db/models/Visita';
import OrdemDeServico from '../../db/models/OrdemDeServico';
import { AppStackParamList } from '../../types/navigation';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const ETAPAS_ORDENADAS = [
  { key: 'dataSaidaEmpresa', label: 'Saída da Empresa' },
  { key: 'dataChegadaCliente', label: 'Chegada no Cliente' },
  { key: 'dataSaidaCliente', label: 'Saída do Cliente' },
  { key: 'dataChegadaEmpresa', label: 'Chegada na Empresa' },
] as const;

type EtapaKey = (typeof ETAPAS_ORDENADAS)[number]['key'];

interface DatabaseProps {
  visita: Visita | null;
  ordens: OrdemDeServico[];
}

type NavProps = NativeStackScreenProps<AppStackParamList, 'RegistroEtapa'>;
type Props = NavProps & DatabaseProps;

export const RawRegistroEtapaScreen = ({
  visita,
  ordens,
  navigation,
}: Props) => {
  const [imagem, setImagem] = useState<string | null>(null);
  const [horarioManual, setHorarioManual] = useState('');
  const [editandoHorario, setEditandoHorario] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!visita) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>
          Erro: Visita não encontrada no banco de dados.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonDisabled}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getProximaEtapa = (): { key: EtapaKey; label: string } | null => {
    for (const etapa of ETAPAS_ORDENADAS) {
      if (!visita[etapa.key]) {
        return etapa;
      }
    }
    return null;
  };

  const proximaEtapa = getProximaEtapa();

  const temOsPendente = ordens.some((os) => {
    const status = os.status;
    return status !== 'CONCLUIDA' && status !== 'CANCELADA';
  });

  const isBloqueado = proximaEtapa?.key === 'dataSaidaCliente' && temOsPendente;

  const handleIniciarRegistro = () => {
    if (isBloqueado) return;

    const agora = new Date();
    setHorarioManual(agora.toISOString());

    Alert.alert(
      'Confirmar Horario',
      `O horário registrado será: ${agora.toLocaleTimeString()}. Deseja manter ou editar?`,
      [
        {
          text: 'Editar',
          onPress: () => setEditandoHorario(true),
        },
        {
          text: 'Confirmar',
          onPress: () => salvarEtapaNoBanco(agora),
        },
      ],
      { cancelable: false }
    );
  };

  const salvarEtapaNoBanco = async (dataParaSalvar: Date) => {
    if (!proximaEtapa) return;
    setSaving(true);

    try {
      await database.write(async () => {
        await visita.update((v) => {
          v[proximaEtapa.key] = dataParaSalvar;

          if (proximaEtapa.key === 'dataSaidaEmpresa')
            v.status = 'EM_DESLOCAMENTO';
          if (proximaEtapa.key === 'dataChegadaCliente')
            v.status = 'EM_ATENDIMENTO';
          if (proximaEtapa.key === 'dataSaidaCliente') v.status = 'RETORNANDO';
          if (proximaEtapa.key === 'dataChegadaEmpresa') v.status = 'CONCLUIDA';
        });

        if (imagem) {
          const anexosCollection = database.collections.get('anexos');
          await anexosCollection.create((anexo: any) => {
            anexo.urlArquivo = imagem;
            anexo.tipoArquivo = 'FOTO';
            anexo.descricao = `Etapa: ${proximaEtapa.label}`;
            anexo.visitaId = visita.id;
            anexo.ordemDeServicoId = 'vinculo_visita_temp';
          });
        }
      });

      Alert.alert('Sucesso', `${proximaEtapa.label} registrada!`);

      setImagem(null);
      setEditandoHorario(false);
      setHorarioManual('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar no banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (isBloqueado) return;

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permissão necessária', 'Habilite a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const handlePressOS = (osId: string) => {
    const chegou = !!visita.dataChegadaCliente;
    const saiu = !!visita.dataSaidaCliente;

    if (!chegou) {
      Alert.alert('Aguarde', 'Registre a chegada antes de iniciar o serviço.');
      return;
    }
    if (saiu) {
      Alert.alert('Fechado', 'Visita já encerrada no local.');
      return;
    }
    navigation.navigate('DefectForm', { osId });
  };

  const renderChecklist = () => {
    return ETAPAS_ORDENADAS.map((etapa) => {
      const dataRealizada: Date | undefined = visita[etapa.key];
      const isConcluido = !!dataRealizada;

      return (
        <View key={etapa.key} style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>{etapa.label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isConcluido && (
              <Text style={styles.dataText}>
                {dataRealizada.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
            <Text style={[styles.checkIcon, isConcluido && styles.checkActive]}>
              {isConcluido ? '✔' : '○'}
            </Text>
          </View>
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Etapa</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progresso</Text>
        {renderChecklist()}
      </View>

      {/* Lista de OSs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordens de Serviço</Text>
        {ordens.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma OS vinculada.</Text>
        ) : (
          ordens.map((os) => (
            <TouchableOpacity
              key={os.id}
              style={styles.osItem}
              onPress={() => handlePressOS(os.id)}
            >
              <View>
                <Text style={{ fontWeight: 'bold' }}>OS #{os.numeroOs}</Text>
                <Text
                  style={{
                    color: os.status === 'CONCLUIDA' ? 'green' : '#555',
                  }}
                >
                  {os.status || '--N/A--'}
                </Text>
              </View>
              <Text>→</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Área de Ação (Próxima Etapa) */}
      {proximaEtapa ? (
        <View style={styles.actionContainer}>
          <Text style={styles.labelProxima}>Próxima: {proximaEtapa.label}</Text>

          {isBloqueado && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Você deve concluir ou cancelar todas as OSs antes de
                registrar a saída.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.imageButton, isBloqueado && styles.buttonDisabled]}
            onPress={handlePickImage}
          >
            <Text
              style={[
                styles.imageButtonText,
                isBloqueado && styles.textDisabled,
              ]}
            >
              {imagem ? '📷 Foto Anexada' : '📷 Foto (Opcional)'}
            </Text>
          </TouchableOpacity>

          {/* Botão Principal */}
          {!editandoHorario && (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                isBloqueado && styles.buttonDisabled,
              ]}
              onPress={handleIniciarRegistro}
            >
              <Text
                style={[
                  styles.categoryText,
                  isBloqueado && styles.textDisabled,
                ]}
              >
                Registrar Horário
              </Text>
            </TouchableOpacity>
          )}

          {/* Modo Edição Manual */}
          {editandoHorario && !isBloqueado && (
            <View style={styles.editContainer}>
              <Text style={styles.label}>Editar horário (ISO):</Text>
              <TextInput
                style={styles.input}
                value={horarioManual}
                onChangeText={setHorarioManual}
              />
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  { marginTop: 10, backgroundColor: '#27ae60' },
                ]}
                onPress={() => salvarEtapaNoBanco(new Date(horarioManual))}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.categoryText}>Salvar Edição</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditandoHorario(false)}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: 'red', textAlign: 'center' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.completedText}>Visita Finalizada!</Text>
      )}
    </ScrollView>
  );
};

const enhance = withObservables(['route'], ({ route }: NavProps) => {
  if (!route?.params?.visitaId) {
    return {
      visita: of(null),
      ordens: of([]),
    };
  }

  const visitaObservable = database.collections
    .get<Visita>('visitas')
    .findAndObserve(route.params.visitaId);

  return {
    visita: visitaObservable,
    ordens: visitaObservable.pipe(
      switchMap((visita) => {
        if (!visita) return of([]);
        return visita.ordens.observe();
      })
    ),
  };
});

export default enhance(RawRegistroEtapaScreen);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0D47A1',
    fontSize: 18,
  },
  section: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1565C0',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#000',
  },
  dataText: {
    fontSize: 12,
    color: '#777',
    marginRight: 5,
  },
  checkIcon: {
    fontSize: 16,
    color: '#ccc',
  },
  checkActive: {
    color: 'green',
    fontWeight: 'bold',
  },
  osItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
    padding: 10,
  },
  actionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  labelProxima: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  categoryButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageButton: {
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 5,
  },
  imageButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  editContainer: {
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#fff',
  },
  completedText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#bdbdbd',
    borderWidth: 1,
    elevation: 0,
    opacity: 1,
  },
  textDisabled: { color: '#9e9e9e' },
  warningContainer: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeeba',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});
