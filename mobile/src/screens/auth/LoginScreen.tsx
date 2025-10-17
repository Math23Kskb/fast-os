import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../../services/authService';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha o usuário e a senha.');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await loginUser({ username, password });

      await SecureStore.setItemAsync('authToken', data.token);

      Alert.alert('Sucesso!', 'Login realizado.');
      // TODO: Implementar navegação para a tela principal (Home)
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator
          testID="activity-indicator"
          size="large"
          color="#0000ff"
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Entrar" onPress={handleLogin} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: '80%',
    height: 100,
    marginBottom: 40,
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  buttonContainer: { width: '80%' },
});
