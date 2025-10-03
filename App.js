import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WalkScreen from "./src/screens/WalkScreen";
import MapScreen from "./src/screens/MapScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import MusicScreen from "./src/screens/MusicScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Caminar" component={WalkScreen} />
        <Tab.Screen name="Mapa" component={MapScreen} />
        <Tab.Screen name="Notificaciones" component={NotificationScreen} />
        <Tab.Screen name="Música" component={MusicScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
