import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import OrdemDeServico from '../../db/models/OrdemDeServico';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../db';
import { observeOrdensDeServico } from '../../db/repositories/OrdemDeServicoRepository';

export type NavProps = NativeStackScreenProps<AppStackParamList, 'ListOS'>;

export interface DatabaseProps {
  ordens: OrdemDeServico[];
}

export type Props = NavProps & DatabaseProps;

interface ListItemProps {
  item: OrdemDeServico;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const ListItem = React.memo(
  ({ item, isSelected, onPress, onLongPress }: ListItemProps) => (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelecionado]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.titulo, isSelected && styles.textoSelecionado]}>
          OS: {item.numeroOs}
        </Text>
        <Text
          style={[styles.descricao, isSelected && styles.textoSelecionado]}
          numberOfLines={1}
        >
          Status: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

export const RawListOSScreen = ({ ordens, navigation }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  // Toque simples
  const handlePress = (id: string) => {
    if (multiSelectMode) {
      setSelected((prev) => {
        const newSelection = prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id];

        if (newSelection.length === 0) {
          setMultiSelectMode(false);
        }
        return newSelection;
      });
    } else {
      setSelected((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  // Toque longo
  const handleLongPress = (id: string) => {
    setMultiSelectMode(true);
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleButtonPress = () => {
    const json = JSON.stringify({ ids: selected });
    console.log(json);
    console.log('Navegaria para outra tela com os IDs:', selected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ordens de Serviço</Text>

      <Text style={styles.labelSelected}>
        {multiSelectMode ? selected.length + ' selecionado(s)' : ''}
      </Text>

      <FlatList
        data={ordens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            isSelected={selected.includes(item.id)}
            onPress={() => handlePress(item.id)}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma Ordem de Serviço encontrada.
          </Text>
        }
      />

      {/* Botão inferior */}
      <TouchableOpacity
        style={[
          styles.botao,
          selected.length === 0 && styles.botaoDesabilitado,
        ]}
        disabled={selected.length === 0}
        onPress={handleButtonPress}
      >
        <Text
          style={[
            styles.textoBotao,
            selected.length === 0 && styles.textoBotaoDesabilitado,
          ]}
        >
          {selected.length === 0
            ? 'Selecione uma OS'
            : `Visualizar (${selected.length})`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface InjectedProps {
  ordens: OrdemDeServico[];
}

const enhance = withObservables<Props, InjectedProps>([], () => ({
  ordens: observeOrdensDeServico(),
}));

export const ListOSScreen = enhance(RawListOSScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  iconBack: {},
  labelSelected: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
  },
  lista: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemSelecionado: {
    backgroundColor: '#4a69bd33',
    borderColor: '#4a69bd',
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: '#555',
  },
  textoSelecionado: {
    color: '#4a69bd',
  },
  botao: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    right: 20,
    backgroundColor: '#4a69bd',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoBotaoDesabilitado: {
    color: '#666',
  },
});
