import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Layout from '../components/Layout';
import { supabase } from '../../supabase';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [caminatas, setCaminatas] = useState([]);
  const [selectedCaminata, setSelectedCaminata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    fetchCaminatas();
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // 🔹 Cargar caminatas desde Supabase
  const fetchCaminatas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('caminatas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setCaminatas(data);
    } catch (error) {
      console.error('Error al obtener caminatas:', error.message);
      Alert.alert('Error', 'No se pudieron cargar las caminatas');
    } finally {
      setLoading(false);
    }
  };

  const selectCaminata = (caminata) => {
    setSelectedCaminata(caminata);
  };

  return (
    <Layout style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Cargando caminatas...</Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={location}
            showsUserLocation={true}
          >
            {selectedCaminata && selectedCaminata.ubicacion && (
              <Polyline
                coordinates={selectedCaminata.ubicacion}
                strokeColor="#FF0000"
                strokeWidth={3}
              />
            )}

            {caminatas.map((c, index) => (
              <Marker
                key={index}
                coordinate={c.ubicacion && c.ubicacion[0]}
                title={c.titulo || `Caminata ${index + 1}`}
                description={`Distancia: ${c.distancia_km || 0} km - Duración: ${c.duracion_min || 0} min`}
                onPress={() => selectCaminata(c)}
              />
            ))}
          </MapView>

          <View style={styles.routesList}>
            <Text style={styles.title}>Historial de Caminatas</Text>
            {caminatas.length === 0 && <Text>No hay caminatas registradas.</Text>}

            {caminatas.map((c, index) => (
              <TouchableOpacity
                key={index}
                style={styles.routeItem}
                onPress={() => selectCaminata(c)}
              >
                <Text>{c.titulo || `Caminata ${index + 1}`}</Text>
                <Text>Distancia: {c.distancia_km || 0} km</Text>
                <Text>Duración: {c.duracion_min || 0} min</Text>
                <Text>Fecha: {new Date(c.fecha).toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.7,
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
