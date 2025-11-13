import { Header } from '../../componets/Header';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export function InfoOSScreen() {
  const [dados, setDados] = useState({});

  useEffect(() => {
    // rota do servidor
    fetch('')
      .then((response) => response.json())
      .then((data) => setDados(data))
      .catch((error) => console.error('Erro ao buscar dados:', error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      <Text style={styles.title}>Informação do OS</Text>

      <View style={styles.table}>
        <View style={styles.row}>
          <View style={[styles.cell, { flex: 1.5, borderRightWidth: 1 }]}>
            <Text>OS.N: {/*dados.osn*/}</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>Data: {/*dados.data*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text style={styles.center}>Dados do Cliente</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Cliente: {/*dados.cliente*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, { flex: 1.2, borderRightWidth: 1 }]}>
            <Text>Contato: {/*dados.contato*/}</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>Tell: {/*dados.telefone*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Endereço: {/*dados.endereco*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, { flex: 1, borderRightWidth: 1 }]}>
            <Text>Bairro: {/*dados.bairro*/}</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>Cidade: {/*dados.cidade*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Código do Cliente: {/*dados.codigo*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Pedido: {/*dados.pedido*/}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.cell, { flex: 1, borderRightWidth: 1 }]}>
            <Text>Data.Fat: {/*dados.dataFat*/}</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>Garantia: {/*dados.garantia*/}</Text>
          </View>
        </View>
      </View>

      {/* --- TABELA DO TÉCNICO --- */}
      <Text style={styles.title}>Dados do Técnico</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Nome: {/*dados.tecnico*/}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Email: {/*dados.email*/}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Empresa: {/*dados.empresa*/}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, { flex: 1, borderRightWidth: 1 }]}>
            <Text>Cidade: {/*dados.cidadeTecnico*/}</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>Tell: {/*dados.telefoneTecnico*/}</Text>
          </View>
        </View>
      </View>

      {/* --- DESCRIÇÃO DA CHAMADA --- */}
      <Text style={styles.title}>Descrição da Chamada</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>N.Series: {/*dados.nserie*/}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Tipo: {/*dados.tipo*/}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFull}>
            <Text>Observação: {/*dados.obs*/}</Text>
          </View>
        </View>
      </View>

      {/* Botaoes */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.b_cancelar}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.b_iniciar}>
          <Text style={styles.btnText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
    opacity: 0.8,
  },
  table: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    marginVertical: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  cell: {
    flex: 1,
    padding: 6,
    justifyContent: 'center',
  },
  cellFull: {
    flex: 1,
    padding: 6,
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  b_cancelar: {
    backgroundColor: 'red',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
    opacity: 0.8,
  },
  b_iniciar: {
    backgroundColor: '#4a69bd',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
    opacity: 0.8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
