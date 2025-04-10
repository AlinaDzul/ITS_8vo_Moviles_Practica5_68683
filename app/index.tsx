import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ImageBackground } from 'react-native';
import { TextInput, Button, Card, Text, Title } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { api } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!correo || !password) {
      return alert('¡Oye, pequeño soñador! No dejes los campos vacíos, ¿vale?');
    }

    if (!isValidEmail(correo)) {
      return alert('¡Ese correo parece un chiste mal escrito! Pon uno de verdad.');
    }

    setLoading(true);
    try {
      await api.login(correo, password);
      router.replace('/inicio');
    } catch (error) {
      alert('¡Ups! El usuario o la contraseña están jugando al escondite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        style={styles.background}
        blurRadius={3}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Bienvenido a tus notas</Title>
                <Text style={styles.subtitle}>Explora tus ideas</Text>

                <TextInput
                  label="Correo electrónico"
                  value={correo}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  Iniciar sesión
                </Button>

                <TouchableOpacity onPress={() => router.replace('/registro')}>
                  <Text style={styles.link}>¿Eres nuevo? <Text style={{ fontWeight: 'bold' }}>Crear cuenta</Text></Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </MotiView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#FF69B4', 
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 24,
    elevation: 10,
    padding: 20,
    backgroundColor: '#FFF0F5', 
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
    color: '#C71585', 
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#FF1493', 
  },
  input: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFE4E1', 
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#FF69B4', 
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#FF1493', 
  },
});
