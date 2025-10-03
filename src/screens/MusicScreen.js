import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MusicScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Música Relajante</Text>
      <Text style={styles.text}>La funcionalidad de reproducción de música ha sido removida para evitar dependencias externas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
