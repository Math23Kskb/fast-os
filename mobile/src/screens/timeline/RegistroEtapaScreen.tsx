import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { EtapasService, EtapaKey, EtapasData } from '../services/EtapasService';

const service = new EtapasService();

export default function RegistroEtapaScreen() {
  const [etapas, setEtapas] = useState<EtapasData>({});
  const [etapaAtual, setEtapaAtual] = useState<EtapaKey | null>(null);

  const [imagem, setImagem] = useState<string | null>(null);
  const [horario, setHorario] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await service.getEtapas();
      setEtapas(data);

      const proxima = EtapasService.getProximaEtapa(data);
      setEtapaAtual(proxima);
    })();
  }, []);

  const registrarHorario = () => {
    const agora = new Date().toISOString();
    setHorario(agora);

    Alert.alert(
      'Horário registrado',
      'Deseja editar manualmente?',
      [
        {
          text: 'Sim',
          onPress: () => setConfirmado(true),
        },
        {
          text: 'Não',
          onPress: () => salvarEtapa(agora),
        },
      ],
      { cancelable: false }
    );
  };

  const salvarEtapa = async (valorHorario: string) => {
    if (!etapaAtual) return;

    await service.atualizarEtapa(etapaAtual, valorHorario, imagem ?? undefined);

    Alert.alert('Sucesso', 'Etapa registrada com sucesso!');
  };

  const escolherImagem = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    const permGal = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted || !permGal.granted) {
      Alert.alert('Permissões necessárias', 'Habilite a câmera e galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const renderChecklist = () => {
    const ordem: EtapaKey[] = [
      'saidaEmpresa',
      'chegadaCliente',
      'saidaCliente',
      'chegadaEmpresa',
    ];

    return ordem.map((etapa) => (
      <View key={etapa} style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>{etapa}</Text>
        <Text>{etapas[etapa] ? '✔' : '○'}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Etapa</Text>

      {etapaAtual ? (
        <Text style={styles.label}>
          Próxima etapa:{' '}
          <Text style={{ fontWeight: 'bold' }}>{etapaAtual}</Text>
        </Text>
      ) : (
        <Text style={styles.label}>Todas as etapas foram concluídas.</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progresso</Text>
        {renderChecklist()}
      </View>

      {/* Botão Registrar Horário */}
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={registrarHorario}
      >
        <Text style={styles.categoryText}>Registrar horário</Text>
      </TouchableOpacity>

      {/* Editar horário manualmente */}
      {confirmado && (
        <>
          <Text style={styles.label}>Editar horário:</Text>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
          />

          <TouchableOpacity
            style={[styles.categoryButton, { marginTop: 10 }]}
            onPress={() => salvarEtapa(horario)}
          >
            <Text style={styles.categoryText}>Confirmar</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Selecionar imagem */}
      <TouchableOpacity style={styles.imageButton} onPress={escolherImagem}>
        <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
      </TouchableOpacity>

      {/* Preview da imagem */}
      {imagem && (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imagem }} style={styles.imagePreview} />
        </View>
      )}
    </View>
  );
}

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
  categoryButton: {
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderColor: '#003351',
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#003351',
  },
  categoryText: {
    textAlign: 'center',
    color: '#0D47A1',
    fontWeight: 'bold',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 16,
    borderTopWidth: 1,
    borderColor: '#003351',
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
    alignItems: 'center',
    marginBottom: 6,
  },
  checkboxLabel: {
    color: '#000',
    fontSize: 15,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    color: '#0D47A1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FAFAFA',
  },
  imageButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    width: 150,
    height: 150,
    marginTop: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
