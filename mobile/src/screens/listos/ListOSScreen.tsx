import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';

interface OrdemServico {
  id: string;
  cliente: string;
  descricao: string;
}

export const ListOSScreen = () => {
  const list: OrdemServico[] = [
    { id: '1', cliente: 'Cliente A', descricao: 'Troca de peça' },
    { id: '2', cliente: 'Cliente B', descricao: 'Manutenção geral' },
    { id: '3', cliente: 'Cliente C', descricao: 'Instalação elétrica' },
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  // Toque simples
  const handlePress = (id: string) => {
    if (multiSelectMode) {
      // No modo múltiplo: adiciona ou remove da seleção
      setSelected((prev) => {
        const newSelection = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];

        // Se não restar nenhum selecionado, sai do modo múltiplo
        if (newSelection.length === 0) setMultiSelectMode(false);
        return newSelection;
      });
    } else {
      // No modo simples: seleciona apenas um
      setSelected((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  // Toque longo
  const handleLongPress = (id: string) => {
    // Ativa o modo múltiplo, se ainda não estiver
    if (!multiSelectMode) setMultiSelectMode(true);

    // Adiciona ou remove o item da seleção
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleButtonPress = () => {
    const json = JSON.stringify({ ids: selected });
    console.log(json);
  };

  const renderItem = ({ item }: { item: OrdemServico }) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelecionado]}
        onPress={() => handlePress(item.id)}
        onLongPress={() => handleLongPress(item.id)}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.titulo, isSelected && styles.textoSelecionado]}>
            {item.cliente}
          </Text>
          <Text
            style={[styles.descricao, isSelected && styles.textoSelecionado]}
            numberOfLines={1}
          >
            {item.descricao}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logout.jpg')}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          tintColor: '#007AFF',
        }}
      />

      <Text style={styles.header}>Ordens de Serviço</Text>

      <Text style={styles.labelSelected}>
        {multiSelectMode ? selected.length + ' selecionado(s)' : ''}
      </Text>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
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
          {selected.length === 0 ? 'Selecione uma OS' : `Visualizar`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
