import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadRoutes();
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

  const loadRoutes = async () => {
    try {
      const data = await AsyncStorage.getItem('walkHistory');
      if (data) {
        const history = JSON.parse(data);
        setRoutes(history);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const selectRoute = (route) => {
    setSelectedRoute(route);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
      >
        {selectedRoute && selectedRoute.route && (
          <Polyline
            coordinates={selectedRoute.route}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
        {routes.map((route, index) => (
          <Marker
            key={index}
            coordinate={route.route[0]}
            title={`Caminata ${index + 1}`}
            description={`Pasos: ${route.steps}, Distancia: ${route.distance.toFixed(2)}m`}
            onPress={() => selectRoute(route)}
          />
        ))}
      </MapView>

      <View style={styles.routesList}>
        <Text style={styles.title}>Historial de Caminatas</Text>
        {routes.map((route, index) => (
          <TouchableOpacity
            key={index}
            style={styles.routeItem}
            onPress={() => selectRoute(route)}
          >
            <Text>Caminata {index + 1}</Text>
            <Text>Pasos: {route.steps}</Text>
            <Text>Distancia: {route.distance.toFixed(2)} m</Text>
            <Text>Tiempo: {route.time} s</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
});
