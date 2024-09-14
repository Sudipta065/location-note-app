import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { db, auth } from '../config/firebase';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

const NoteScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState(null);

  const { noteId } = route.params || {};

  useEffect(() => {

    if (noteId) {
      const getNote = async () => {
        const docRef = doc(db, 'notes', noteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setBody(data.body);
        }
      };
      getNote();
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);
      }
    })();

    navigation.setOptions({
      title: noteId ? 'Edit Note' : 'Add Note',
    });
  }, [noteId, navigation]);

  const saveNote = async () => {
    const noteData = {
      title,
      body,
      date: new Date(),
      location: location?.coords || null,
      userId: auth?.currentUser.uid,
    };
    try {
      if (noteId) {
        await setDoc(doc(db, 'notes', noteId), noteData);
      } else {
        const newNoteRef = await addDoc(collection(db, 'notes'), noteData);
      }
      navigation.navigate('LandingScreen');
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Body"
        value={body}
        onChangeText={setBody}
        style={styles.textArea}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.saveButtonText}>
          {noteId ? 'Edit Note' : 'Add Note'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#3450a1',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#041955',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoteScreen;
