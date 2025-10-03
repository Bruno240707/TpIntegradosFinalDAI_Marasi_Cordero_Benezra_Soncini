import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WalkScreen from "./src/screens/WalkScreen";
import MapScreen from "./src/screens/MapScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import MusicScreen from "./src/screens/MusicScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Caminar" component={WalkScreen} options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="walk" size={24} color={color} />
              ),
            }}/>
          <Tab.Screen name="Mapa" component={MapScreen} options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="map" size={24} color={color} />
              ),
            }}/>
          <Tab.Screen name="Notificaciones" component={NotificationScreen} options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="notifications" size={24} color={color} />
              ),
            }}/>
          <Tab.Screen name="Música" component={MusicScreen} options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="musical-notes" size={24} color={color} />
              ),
            }}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
