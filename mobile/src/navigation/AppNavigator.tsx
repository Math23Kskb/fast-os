import '../db';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, AppStackParamList } from '../types/navigation';
import { getToken } from '../api/tokenManager';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ListOSScreen } from '../screens/listos/ListOSScreen';
import { ActivityIndicator, View } from 'react-native';
import { sync } from '../api/services/syncService';

const AppStackNav = createNativeStackNavigator<AppStackParamList>();
const RootStackNav = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => {
  return (
    <AppStackNav.Navigator>
      <AppStackNav.Screen
        name="ListOS"
        component={ListOSScreen}
        options={{
          title: 'Ordens de Serviço',
          headerBackVisible: false,
        }}
      />
      {/* Outras telas do app viriam aqui */}
    </AppStackNav.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);

        if (token) {
          try {
            console.log('Usuário autenticado. Tentando sincronizar dados...');
            await sync();
          } catch (syncError) {
            console.warn(
              'Sincronização falhou (provavelmente offline), mas o app continuará a funcionar com dados locais.',
              syncError
            );
          }
        }
      } catch (authError) {
        console.error('Falha na verificação de autenticação:', authError);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
        {authToken ? (
          <RootStackNav.Screen name="App" component={AppStack} />
        ) : (
          <RootStackNav.Screen name="Login" component={LoginScreen} />
        )}
      </RootStackNav.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
