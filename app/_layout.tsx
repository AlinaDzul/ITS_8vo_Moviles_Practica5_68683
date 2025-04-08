import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CreateNoteScreen from './create-note';
import ListNotesScreen from '.';
import { Stack } from 'expo-router';

const App = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={
          {
            title: 'Mis Notas',
          }
        }
      />
      <Stack.Screen
        name='create-note'
        options={
          {
            title: 'Crear nueva nota'
          }
        }
      />
    </Stack>
  );
};
export default App;