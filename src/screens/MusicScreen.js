import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import Layout from '../components/Layout';
import { supabase } from '../../supabase';

export default function MusicScreen() {
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerMusicas();
  }, []);

  const obtenerMusicas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('musicas')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al obtener músicas:', error);
    } else {
      setMusicas(data);
    }
    setLoading(false);
  };

  const abrirEnlace = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('No se pudo abrir el enlace:', err)
      );
    }
  };

  const renderMusica = ({ item }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => abrirEnlace(item.url)}
    >
      <Text style={styles.musicTitle}>{item.titulo}</Text>
      {item.artista && <Text style={styles.musicArtist}>{item.artista}</Text>}
      {item.url && (
        <Text style={styles.musicLink}>🎧 Escuchar</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>🎶 Música Relajante</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : musicas.length === 0 ? (
        <Text style={styles.text}>No hay canciones disponibles por ahora.</Text>
      ) : (
        <FlatList
          data={musicas}
          renderItem={renderMusica}
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  musicItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  musicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  musicArtist: {
    fontSize: 15,
    color: '#555',
  },
  musicLink: {
    fontSize: 15,
    color: '#1E90FF',
    marginTop: 5,
  },
});
