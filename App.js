import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import WalkScreen from "./src/screens/WalkScreen";
import MapScreen from "./src/screens/MapScreen";

import LoginScreen from "./src/screens/LoginScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Text style={{ color: '#3498db', fontSize: 16 }}>Cerrar Sesión</Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Caminar" component={WalkScreen} options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="walk" size={24} color={color} />
          ),
        }}/>
          <Tab.Screen name="Caminatas" component={MapScreen} options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="map" size={24} color={color} />
              ),
            }}/>

    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
