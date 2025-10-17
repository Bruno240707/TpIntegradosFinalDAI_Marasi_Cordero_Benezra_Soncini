import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import { supabase } from '../../supabase';

export default function NotificationScreen() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  const obtenerNotificaciones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('enviada_en', { ascending: false });

    if (error) {
      console.error('Error al obtener notificaciones:', error);
    } else {
      setNotificaciones(data);
    }
    setLoading(false);
  };

  const marcarComoLeida = async (id) => {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id);

    if (!error) {
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    }
  };

  const renderNotificacion = ({ item }) => (
    <TouchableOpacity
      style={[styles.notification, item.leida && styles.leida]}
      onPress={() => marcarComoLeida(item.id)}
    >
      <Text style={styles.notificationTitle}>{item.titulo}</Text>
      <Text style={styles.notificationMessage}>{item.mensaje}</Text>
      <Text style={styles.notificationDate}>
        {new Date(item.enviada_en).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : notificaciones.length === 0 ? (
        <Text style={styles.text}>No tienes notificaciones por ahora.</Text>
      ) : (
        <FlatList
          data={notificaciones}
          renderItem={renderNotificacion}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  notification: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  leida: {
    opacity: 0.6,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 15,
    marginVertical: 5,
  },
  notificationDate: {
    fontSize: 13,
    color: '#666',
    textAlign: 'right',
  },
});
