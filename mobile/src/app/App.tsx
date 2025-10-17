import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LoginScreen />
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
