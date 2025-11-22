import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../../db';
import Visita from '../../db/models/Visita';
import { AppStackParamList } from '../../types/navigation';
import { switchMap } from 'rxjs/operators';

export type NavProps = NativeStackScreenProps<AppStackParamList, 'ListOS'>;

export interface DatabaseProps {
  visitas: Visita[];
}

export type Props = NavProps & DatabaseProps;

const VisitaItem = ({
  item,
  onPress,
}: {
  item: Visita;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.textContainer}>
      <Text style={styles.titulo}>Visita</Text>
      <Text style={styles.subtitulo}>ID: {item.id.slice(0, 8)}...</Text>

      {/* Status colorido */}
      <View style={styles.statusContainer}>
        <Text style={styles.labelStatus}>Status:</Text>
        <Text
          style={[
            styles.statusValor,
            item.status === 'CONCLUIDA'
              ? styles.statusVerde
              : styles.statusAzul,
          ]}
        >
          {item.status || 'PENDENTE'}
        </Text>
      </View>
    </View>

    <Text style={styles.arrow}>→</Text>
  </TouchableOpacity>
);

export const RawListOSScreen = ({ visitas, navigation }: Props) => {
  const handlePressVisita = (visitaId: string) => {
    navigation.navigate('InfoOS', { visitaId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Visitas</Text>

      <FlatList
        data={visitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VisitaItem item={item} onPress={() => handlePressVisita(item.id)} />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma visita agendada.</Text>
          </View>
        }
      />
    </View>
  );
};

const enhance = withObservables([], () => ({
  visitas: database.collections.get<Visita>('visitas').query().observe(),
}));

export const ListOSScreen = enhance(RawListOSScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  subtitulo: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 4,
  },
  statusValor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusAzul: {
    color: '#2980b9',
  },
  statusVerde: {
    color: '#27ae60',
  },
  arrow: {
    fontSize: 24,
    color: '#bdc3c7',
    marginLeft: 10,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 20,
  },
  buttonTeste: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
