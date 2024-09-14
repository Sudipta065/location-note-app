import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";

interface Note {
  id: string;
  title: string;
  body: string;
  date?: {
    seconds: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

const LandingScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const navigation = useNavigation();

  useEffect(() => {
    const checkLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    };

    checkLocationPermission();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "notes"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ ...doc.data(), id: doc.id } as Note);
        });
        setNotes(notesData);
      });
      return () => unsubscribe();
    } else {
      navigation.replace("LoginScreen");
    }
  }, [navigation]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace("LoginScreen");
    });
  };

  const handleDelete = async (noteId: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const noteRef = doc(db, "notes", noteId);
            await deleteDoc(noteRef);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome, {auth.currentUser?.displayName || "Guest"} !!!
      </Text>

      {!locationPermission && (
        <Text style={styles.noLocationPermissionText}>
          Location access is required to view note locations.
        </Text>
      )}

      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>
          You have no notes. Start by adding one using the + Button at the
          bottom !
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.cardDate}>
                Created:{" "}
                {item.date
                  ? new Date(item.date.seconds * 1000).toLocaleDateString()
                  : "No date"}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("NoteScreen", { noteId: item.id })
                  }
                >
                  <Ionicons name="create-outline" size={16} color="white" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.plus}
        onPress={() => navigation.navigate("NoteScreen")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#3450a1",
  },
  welcomeText: {
    fontSize: 22,
    marginBottom: 16,
    color: "#fff",
  },
  noLocationPermissionText: {
    fontSize: 16,
    color: "#E74C3C",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  noNotesText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  plus: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#1ABC9C",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  logout: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "100%",
    backgroundColor: "#E74C3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#041955",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3450a1",
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    marginBottom: 8,
    color: "#fff",
  },
  cardDate: {
    fontSize: 12,
    color: "#fefefe",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1ABC9C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
});

export default LandingScreen;
