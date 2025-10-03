import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/Layout';

const { width, height } = Dimensions.get('window');

export default function WalkScreen() {
  const [isWalking, setIsWalking] = useState(false);
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const timerRef = useRef(null);
  const accelerometerData = useRef({ x: 0, y: 0, z: 0 });
  const stepThreshold = 1.2; // Adjust based on testing

  useEffect(() => {
    requestPermissions();
    loadWalkData();
    return () => {
      if (subscription) subscription.remove();
      if (locationSubscription) locationSubscription.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const requestPermissions = async () => {
    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (!locationPermission.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para rastrear la caminata.');
    }
  };

  const loadWalkData = async () => {
    try {
      const data = await AsyncStorage.getItem('walkData');
      if (data) {
        const parsed = JSON.parse(data);
        setSteps(parsed.steps || 0);
        setDistance(parsed.distance || 0);
      }
    } catch (error) {
      console.error('Error loading walk data:', error);
    }
  };

  const saveWalkData = async () => {
    try {
      const data = { steps, distance, time, route };
      await AsyncStorage.setItem('walkData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving walk data:', error);
    }
  };

  const startWalk = async () => {
    setIsWalking(true);
    setTime(0);
    setSteps(0);
    setDistance(0);
    setRoute([]);

    // Start timer
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    // Start location tracking
    const locSub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (loc) => {
        const newLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        };
        setLocation(newLocation);
        setRoute(prevRoute => {
          const updatedRoute = [...prevRoute, newLocation];

          if (prevRoute.length > 0) {
            const last = prevRoute[prevRoute.length - 1];
            const dist = getDistance(last.latitude, last.longitude, newLocation.latitude, newLocation.longitude);
            setDistance(prevDist => prevDist + dist);
          }

          return updatedRoute;
        });
      }
    );
    setLocationSubscription(locSub);

    // Start accelerometer for steps
    Accelerometer.setUpdateInterval(100);
    const accelSub = Accelerometer.addListener((data) => {
      const { x, y, z } = data;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const prevMagnitude = Math.sqrt(accelerometerData.current.x ** 2 + accelerometerData.current.y ** 2 + accelerometerData.current.z ** 2);

      if (prevMagnitude > stepThreshold && magnitude < stepThreshold) {
        setSteps(prev => prev + 1);
      }

      accelerometerData.current = { x, y, z };
    });
    setSubscription(accelSub);
  };

  const stopWalk = async () => {
    setIsWalking(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (subscription) subscription.remove();
    if (locationSubscription) locationSubscription.remove();
    await saveWalkData();
  };



  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Convert to meters
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Tiempo: {formatTime(time)}</Text>
        <Text style={styles.statText}>Pasos: {steps}</Text>
        <Text style={styles.statText}>Distancia: {distance.toFixed(2)} m</Text>
      </View>

      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: location?.latitude || -34.6037,
          longitude: location?.longitude || -58.3816,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, isWalking ? styles.stopButton : styles.startButton]}
          onPress={isWalking ? stopWalk : startWalk}
        >
          <Text style={styles.buttonText}>{isWalking ? 'Detener Caminata' : 'Iniciar Caminata'}</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  controlsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
