import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '../components/Layout';
import { supabase } from '../../supabase';
import { useAuth } from '../contexts/AuthContext';

export default function MapScreen() {
  const [caminatas, setCaminatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchCaminatas();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCaminatas();
    });
    return unsubscribe;
  }, [navigation]);

  // 🔹 Cargar caminatas desde Supabase
  const fetchCaminatas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('caminatas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: true });

      if (error) throw error;
      setCaminatas(data);
    } catch (error) {
      console.error('Error al obtener caminatas:', error.message);
      Alert.alert('Error', 'No se pudieron cargar las caminatas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Cargando caminatas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.routesList}>
          <Text style={styles.title}>Historial de Caminatas</Text>
          {caminatas.length === 0 && <Text>No hay caminatas registradas.</Text>}

          {caminatas.map((c, index) => (
            <View
              key={c.id || index}
              style={styles.routeItem}
            >
              <Text>{`Caminata ${index + 1}`}</Text>
              <Text>Distancia: {c.distancia ? c.distancia.toFixed(2) : 0} m</Text>
              <Text>Duración: {Math.floor((c.duracion || 0) / 60)} min {((c.duracion || 0) % 60)} seg</Text>
              <Text>Pasos: {c.Pasos || 0}</Text>
              <Text>Fecha: {new Date(c.fecha).toLocaleString()}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routesList: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
