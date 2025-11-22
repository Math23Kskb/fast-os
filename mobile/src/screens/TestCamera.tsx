import React from 'react';
import { View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function TestCamera() {
  const openCamera = async () => {
    try {
      console.log('Pedindo permissão...');
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Permissão:', permission);

      if (permission.granted) {
        console.log('Abrindo câmera...');
        const result = await ImagePicker.launchCameraAsync();
        console.log('Resultado:', result);
      }
    } catch (e) {
      console.error('ERRO AO ABRIR CÂMERA:', e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Teste Isolado de Câmera</Text>
      <Button title="Abrir Câmera" onPress={openCamera} />
    </View>
  );
}
