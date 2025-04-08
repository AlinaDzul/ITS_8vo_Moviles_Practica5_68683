import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Segurito que quieres abandonar el barco rosa?',
      [
        { text: 'NO', style: 'cancel' },
        {
          text: 'SÍ',
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Eliminar Nota',
      '¿De verdad quieres mandar esta nota al país de los recuerdos?',
      [
        { text: 'NO', style: 'cancel' },
        { 
          text: 'SÍ', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('¡Oh no!', 'La nota se aferró a la vida, no se pudo eliminar.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#FF69B4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
        <Stack.Screen
            options={{
                title: 'Mis Notas encantadas',
                headerTitleAlign: 'center',
                headerLeft: () => (
                <IconButton
                    icon="arrow-left"
                    iconColor="#C71585"
                    onPress={handleLogout}
                />
                ),
            }}
        />
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {isLoading ? (
            <Text>Cargando tus notas</Text>
            ) : notes.length === 0 ? (
            <Text style={styles.emptyText}>¡Crea tu primera nota, pequeño artista!</Text>
            ) : (
            notes.map(note => (
                <Card key={note.id} style={styles.card}>
                <Card.Title
                    title={note.titulo}
                    titleStyle={styles.cardTitle}
                />
                <Card.Content>
                    <Text 
                    numberOfLines={3} 
                    ellipsizeMode="tail"
                    style={styles.cardContent}
                    >
                    {note.descripcion.replace(/<[^>]*>/g, '').substring(0, 200)}
                    </Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                    <IconButton
                    icon="pencil"
                    size={24}
                    onPress={() => handleEditNote(note.id)}
                    style={styles.actionButton}
                    iconColor="#FF1493"
                    />
                    <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => handleDeleteNote(note.id)}
                    style={styles.actionButton}
                    iconColor="#C71585"
                    />
                </Card.Actions>
                </Card>
            ))
            )}
        </ScrollView>
        
        {/* Floating Action Button */}
        <TouchableOpacity 
            style={styles.fab}
            onPress={() => router.push('/create-note')}
        >
            <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    resizeMode: 'cover',
    backgroundColor: '#FF69B4',
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5', 
  },
  errorText: {
    color: '#C71585', 
    fontSize: 16,
  },
  statusContainer: {
    marginRight: 16,
  },
  completedText: {
    color: '#FF1493', 
  },
  pendingText: {
    color: '#FFB6C1', 
  },
  container: {
    backgroundColor: '#FF69B4', 
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFE4E1', 
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C71585', 
  },
  cardContent: {
    marginTop: 8,
    color: '#FF1493', 
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  actionButton: {
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#FF1493', 
  },
  fab: {
    backgroundColor: '#FF69B4', 
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});