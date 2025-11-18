import React from 'react';
import { DatabaseProvider } from '../contexts/DatabaseProvider';
import AppNavigator from '../navigation/AppNavigator';
import '../db';

export default function App() {
  return (
    <DatabaseProvider>
      <AppNavigator />
    </DatabaseProvider>
  );
}
