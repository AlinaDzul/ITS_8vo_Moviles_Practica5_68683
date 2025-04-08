import React, { useState } from 'react';
import { StyleSheet, ImageBackground, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { TextInput, Button, Card, Text, Title } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { api } from '../services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!correo || !password || !confirmar) {
      return alert('¡Oye, ingeniero! Llena todos los campos, ¿sí?');
    }

    if (password !== confirmar) {
      return alert('¡Ups! Las contraseñas no se dan un besito, no coinciden.');
    }
    
    if (!isValidEmail(correo)) {
      return alert('¡Ese correo parece un unicornio perdido! Usa uno válido.');
    }

    if (password.length < 8) {
      return alert('¡Vamos, dale más amor! La contraseña necesita 8 caracteres o más.');
    }

    setLoading(true);
    try {
      await api.register(correo, password);
      router.replace('/');
    } catch (error) {
      alert('¡Ay, ay, ay! Algo salió mal al registrarte, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        style={styles.background}
        blurRadius={4}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
          <MotiView
            from={{ opacity: 0, translateY: 60 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Únete a la Aventura</Title>
                <Text style={styles.subtitle}>Regístrate para agregar notas</Text>

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
                <TextInput
                  label="Confirmar contraseña"
                  value={confirmar}
                  onChangeText={setConfirmar}
                  secureTextEntry
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  Registrarse
                </Button>

                <TouchableOpacity onPress={() => router.replace('/')}>
                  <Text style={styles.link}>¿Tiene una cuenta? <Text style={{ fontWeight: 'bold' }}>Inicia sesión</Text></Text>
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
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
    color: '#C71585', 
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
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
    fontSize: 14,
  },
});
