import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MultiSelect } from 'react-native-element-dropdown';

import { database } from '../../db';
import OrdemDeServico from '../../db/models/OrdemDeServico';
import { AppStackParamList } from '../../types/navigation';

// Importação das Constantes e Tipos
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  DEFECT_OPTIONS,
  CategoryKey,
} from '../../constants/DefectOptions';
import { DefectFormState } from '../../types/defect';

type NavProps = NativeStackScreenProps<AppStackParamList, 'DefectForm'>;
interface DatabaseProps {
  os: OrdemDeServico;
}
type Props = NavProps & DatabaseProps;

export const RawDefectFormScreen = ({ os, navigation }: Props) => {
  const [diagnostico, setDiagnostico] = useState('');
  const [solucao, setSolucao] = useState('');

  const [formValues, setFormValues] = useState<DefectFormState>({});

  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);
  const [loading, setLoading] = useState(false);

  const iniciado = !!os.dataInicioExecucao;
  const finalizado = !!os.dataFimExecucao;

  useEffect(() => {
    if (os.problemaDetalhado) {
      try {
        const dadosSalvos = JSON.parse(JSON.stringify(os.problemaDetalhado));
        setFormValues(dadosSalvos);

        const categoriasSalvas = Object.keys(dadosSalvos) as CategoryKey[];
        if (categoriasSalvas.length > 0) {
          setActiveCategories(categoriasSalvas);
        }
      } catch (e) {
        console.log('Erro ao carregar JSON', e);
      }
    }

    if (os.diagnosticoTecnico) setDiagnostico(os.diagnosticoTecnico);
    if (os.solucaoAplicada) setSolucao(os.solucaoAplicada);
  }, [os]);

  const toggleCategory = (category: CategoryKey) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectionChange = (category: string, selectedItems: string[]) => {
    setFormValues((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        selected: selectedItems,
      },
    }));
  };

  const handleChangeOutro = (category: string, text: string) => {
    setFormValues((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        outro: text,
      },
    }));
  };

  const handlePickImage = async (category: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5, // Qualidade média para não pesar o banco
    });

    if (!result.canceled) {
      setFormValues((prev) => {
        const currentImages = prev[category]?.imagensTemporarias || [];
        return {
          ...prev,
          [category]: {
            ...(prev[category] || {}),
            imagensTemporarias: [...currentImages, result.assets[0].uri],
          },
        };
      });
    }
  };

  const handleRemoveImage = (category: string, imgIndex: number) => {
    setFormValues((prev) => {
      const currentImages = [...(prev[category]?.imagensTemporarias || [])];
      currentImages.splice(imgIndex, 1);
      return {
        ...prev,
        [category]: { ...prev[category], imagensTemporarias: currentImages },
      };
    });
  };

  // --- AÇÕES DE BANCO DE DADOS ---

  const handleIniciarAtendimento = async () => {
    try {
      await database.write(async () => {
        await os.update((registro) => {
          registro.dataInicioExecucao = new Date();
          registro.status = 'EM_ANDAMENTO';
        });
      });
      Alert.alert('Iniciado', 'Atendimento iniciado com sucesso.');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao iniciar atendimento.');
    }
  };

  const handleFinalizarAtendimento = async () => {
    if (loading) return;

    // Validação 1: Pelo menos um defeito selecionado
    const temDefeito = Object.values(formValues).some(
      (c) => c.selected && c.selected.length > 0
    );
    if (!temDefeito) {
      Alert.alert('Atenção', 'Selecione pelo menos um defeito nas categorias.');
      return;
    }
    // Validação 2: Campos de texto preenchidos
    if (!diagnostico.trim() || !solucao.trim()) {
      Alert.alert('Atenção', 'Preencha o Diagnóstico e a Solução Aplicada.');
      return;
    }

    setLoading(true);

    try {
      await database.write(async () => {
        // 1. Salva dados na OS
        await os.update((registro) => {
          // Campos JSON (Checkboxes, Outros)
          registro.problemaDetalhado = formValues;

          // Campos de Texto (Colunas dedicadas)
          registro.diagnosticoTecnico = diagnostico;
          registro.solucaoAplicada = solucao;

          // Metadados
          registro.dataFimExecucao = new Date();
          registro.status = 'CONCLUIDA';
        });

        // 2. Salva fotos na tabela Anexos
        const anexosCollection = database.collections.get('anexos');
        const promisesDeFotos: Promise<any>[] = [];

        Object.entries(formValues).forEach(([catKey, catData]) => {
          if (
            catData.imagensTemporarias &&
            catData.imagensTemporarias.length > 0
          ) {
            catData.imagensTemporarias.forEach((uri) => {
              promisesDeFotos.push(
                anexosCollection.create((anexo: any) => {
                  anexo.urlArquivo = uri;
                  anexo.tipoArquivo = 'FOTO';
                  anexo.descricao = `Categoria: ${
                    CATEGORY_LABELS[catKey as CategoryKey] || catKey
                  }`;
                  anexo.ordemDeServicoId = os.id;
                  anexo.etapa = 'EXECUCAO';
                })
              );
            });
          }
        });

        await Promise.all(promisesDeFotos);
      });

      Alert.alert('Sucesso', 'Atendimento finalizado!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO ---

  // Tela Inicial (Botão de Start)
  if (!iniciado && !finalizado) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.title}>OS: {os.numeroOs}</Text>
        <Text style={styles.subtitle}>Status: {os.status}</Text>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={handleIniciarAtendimento}
        >
          <Text style={styles.bigButtonText}>▶ INICIAR ATENDIMENTO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OS: {os.numeroOs}</Text>
        <Text style={styles.headerStatus}>{os.status}</Text>
      </View>

      <Text style={styles.instruction}>1. Identifique os problemas:</Text>

      {/* BOTÕES DE CATEGORIA (GRID 2x2) */}
      <View style={styles.categoryButtonsContainer}>
        {CATEGORY_KEYS.map((key) => {
          const isActive = activeCategories.includes(key);
          return (
            <TouchableOpacity
              key={key}
              style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
              onPress={() => toggleCategory(key)}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  isActive && styles.categoryBtnTextActive,
                ]}
              >
                {isActive ? '✓ ' : ''}
                {CATEGORY_LABELS[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* RENDERIZAÇÃO DAS CATEGORIAS ATIVAS */}
      {activeCategories.map((catKey) => {
        const selectedItems = formValues[catKey]?.selected || [];
        // Verifica se "OUTROS" está selecionado para mostrar o input condicional
        const hasOutros = selectedItems.includes('OUTROS');

        return (
          <View key={catKey} style={styles.section}>
            <Text style={styles.sectionTitle}>{CATEGORY_LABELS[catKey]}</Text>

            <Text style={styles.label}>Defeitos:</Text>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={DEFECT_OPTIONS[catKey] || []}
              labelField="label"
              valueField="value"
              placeholder="Selecione os itens..."
              searchPlaceholder="Buscar..."
              value={selectedItems}
              onChange={(item) => handleSelectionChange(catKey, item)}
              selectedStyle={styles.selectedStyle}
              disable={finalizado}
            />

            {/* Campo condicional "Outro" */}
            {hasOutros && (
              <View style={styles.conditionalInputContainer}>
                <Text style={styles.label}>Especifique o outro defeito:</Text>
                <TextInput
                  style={styles.input}
                  value={formValues[catKey]?.outro || ''}
                  onChangeText={(t) => handleChangeOutro(catKey, t)}
                  editable={!finalizado}
                  placeholder="Descreva o defeito..."
                />
              </View>
            )}

            {/* Botão de Foto por Categoria */}
            {!finalizado && (
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => handlePickImage(catKey)}
              >
                <Text style={styles.imageButtonText}>
                  📷 Foto ({CATEGORY_LABELS[catKey]})
                </Text>
              </TouchableOpacity>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesRow}
            >
              {formValues[catKey]?.imagensTemporarias?.map((uri, idx) => (
                <View key={idx} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  {!finalizado && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(catKey, idx)}
                    >
                      <Text style={styles.removeButtonText}>X</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        );
      })}

      {/* 2. FECHAMENTO TÉCNICO (Inputs Gerais Globais) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Fechamento Técnico</Text>

        <Text style={styles.label}>Diagnóstico Técnico (Causa Raiz):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={diagnostico}
          onChangeText={setDiagnostico}
          editable={!finalizado}
          placeholder="Explique o que causou o problema..."
        />

        <Text style={styles.label}>Solução Aplicada:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={solucao}
          onChangeText={setSolucao}
          editable={!finalizado}
          placeholder="Descreva o serviço realizado..."
        />
      </View>

      {/* Footer com Botão Finalizar */}
      {!finalizado && (
        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFinalizarAtendimento}
            >
              <Text style={styles.submitButtonText}>FINALIZAR ATENDIMENTO</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {finalizado && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>✅ Atendimento Finalizado</Text>
          <Text style={styles.completedDate}>
            Em: {os.dataFimExecucao?.toLocaleString()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const enhance = withObservables(['route'], ({ route }) => ({
  os: database.collections
    .get<OrdemDeServico>('ordens_de_servico')
    .findAndObserve(route.params.osId),
}));

export default enhance(RawDefectFormScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },

  // Header
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  headerStatus: { fontSize: 14, color: '#7f8c8d' },

  // Start Screen
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 30 },
  bigButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 5,
  },
  bigButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  instruction: { padding: 15, color: '#555', fontWeight: 'bold', marginTop: 5 },

  // Grid 2x2 Categorias
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryBtn: {
    width: '48%',
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbdefb',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  categoryBtnText: { color: '#1565C0', fontWeight: '600', textAlign: 'center' },
  categoryBtnTextActive: { color: '#fff' },

  // Seção
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 5,
  },

  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fafafa',
    fontSize: 15,
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  // Conditional Input
  conditionalInputContainer: {
    marginTop: 10,
    backgroundColor: '#fff8e1',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffe082',
  },

  // Dropdown
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
  },
  placeholderStyle: { fontSize: 16, color: '#999' },
  selectedTextStyle: { fontSize: 14, color: '#333' },
  inputSearchStyle: { height: 40, fontSize: 16 },
  iconStyle: { width: 20, height: 20 },
  selectedStyle: { borderRadius: 12 },

  // Imagens
  imageButton: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  imageButtonText: { color: '#2196F3', fontWeight: 'bold' },
  imagesRow: { flexDirection: 'row', marginTop: 10 },
  imageWrapper: { marginRight: 10, position: 'relative' },
  imagePreview: { width: 70, height: 70, borderRadius: 6 },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  // Footer
  footer: { padding: 20, paddingBottom: 80 },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  completedContainer: { padding: 30, alignItems: 'center', marginTop: 20 },
  completedText: { fontSize: 20, color: '#27ae60', fontWeight: 'bold' },
  completedDate: { fontSize: 14, color: '#7f8c8d', marginTop: 5 },
});
