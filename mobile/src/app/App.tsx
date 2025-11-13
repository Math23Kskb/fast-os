import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ListOSScreen } from '../screens/listos/ListOSScreen';
import { InfoOSScreen } from '../screens/info/InfoOSScreen';

// Telas adicionais podem ser importadas aqui para facilitar a troca durante o desenvolvimento

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/************************************************************************
       *
       * 👨‍💻 NOTA PARA DESENVOLVEDORES 👩‍💻
       *
       * Para trabalhar na sua tela, comente a <LoginScreen /> e adicione
       * o componente da sua tela aqui temporariamente.
       *
       * ❗ IMPORTANTE: ANTES DE FAZER O COMMIT, VOCÊ DEVE REVERTER ESTE
       * ARQUIVO PARA O SEU ESTADO ORIGINAL, RENDERIZANDO APENAS A <LoginScreen />.
       *
       * Falhar em reverter este arquivo fará com que o CI quebre.
       *
       ************************************************************************/}

      <InfoOSScreen />
      {/* Exemplo de como um dev trabalharia na tela de lista de OS: */}
      {/* <ListServiceOrderScreen /> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default App;
