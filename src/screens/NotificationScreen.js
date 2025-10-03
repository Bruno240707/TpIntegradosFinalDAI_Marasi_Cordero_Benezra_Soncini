import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <Text style={styles.text}>Esta pantalla es para recordatorios de bienestar.</Text>
      <Text style={styles.text}>Funcionalidad de notificaciones removida para evitar dependencias de base de datos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  notification: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
});
