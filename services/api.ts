import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://poster-silent-en-lauderdale.trycloudflare.com/api';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  // Login
  login: async (username: string, password: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Credenciales incorrectas');

    const data = await response.json();
    await AsyncStorage.setItem('token', data.token);
    return data.token;
  },

  // Registro
  register: async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Error al registrarse');
  },

  // Obtener todas las tareas
  getTareas: async (): Promise<Tarea[]> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tareas`, { headers });
    if (!response.ok) throw new Error('Error al obtener tareas');
    return await response.json();
  },

  // Obtener una tarea
  getTarea: async (id: number): Promise<Tarea> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, { headers });
    if (!response.ok) throw new Error(`Error al obtener tarea ${id}`);
    return await response.json();
  },

  // Crear una tarea
  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(tarea),
    });
    if (!response.ok) throw new Error('Error al crear tarea');
    return await response.json();
  },

  // Actualizar una tarea
  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(tarea),
    });
    if (!response.ok) throw new Error(`Error al actualizar tarea ${id}`);
    return await response.json();
  },

  // Eliminar una tarea
  deleteTarea: async (id: number): Promise<void> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(`Error al eliminar tarea ${id}`);
  },

  // Cerrar sesión
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  // Obtener token actual
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
  },
};
