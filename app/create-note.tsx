import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function CreateNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const richText = useRef<CustomRichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    if (id) {
      // Edit mode
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        console.log('Note to edit:', noteToEdit.descripcion);
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor, ingrese un título para su nota.');
      return;
    }
  
    const cleanContent = stripHtml(content); // Clean content
    console.log('Retrieved content:', cleanContent);
  
    try {
      if (id) {
        // Edit mode
        await updateNote(Number(id), { 
          titulo: title, 
          descripcion: cleanContent, 
          completada: completed
        });
      } else {
        await saveNote({
          titulo: title.trim(),
          descripcion: cleanContent, 
          completada: completed
        });
      }
      router.back();
    } catch (error) {
      alert('Lo sentimos, ocurrió un error al guardar la nota.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={false}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Título de su nota"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={setContent}
          placeholder="Escriba el contenido de su nota aquí..."
          useContainer={true}
        />

        <RichToolbar
          editor={richText}
          selectedIconTint="#C71585" // Medium Violet Red
          iconTint="#4A2A3C" 
          scalesPageToFit={Platform.OS === 'android'}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
        />
      </ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleSave()}
      >
        <MaterialIcons name="save" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 4,
    backgroundColor: '#FFF0F5', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD1DC', 
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600', 
    marginVertical: 15,
    color: '#4A2A3C', 
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF69B4', 
  },
  editor: {
    backgroundColor: '#FFFFFF', 
    flex: 1,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#FFD1DC', 
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  toolbar: {
    backgroundColor: '#FFE4E1', 
    borderColor: '#FFD1DC', 
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#C71585', 
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, 
  },
});