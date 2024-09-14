import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, MapViewProps } from "react-native-maps";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebase";

interface Note {
  id: string;
  title: string;
  body: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

const MapScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mapRef = useRef<MapViewProps | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError(new Error("User not authenticated"));
      setLoading(false);
      return;
    }

    // Fetch stored data from store 
    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid) 
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notesData: Note[] = [];
        querySnapshot.forEach((doc) => {
          notesData.push({ ...doc.data(), id: doc.id } as Note);
        });
        setNotes(notesData);
        setLoading(false);

        // Adjust the map to locate the markers
        if (notesData.length > 0 && mapRef.current) {
          const coordinates = notesData
            .filter(note => note.location) 
            .map(note => ({
              latitude: note.location!.latitude,
              longitude: note.location!.longitude,
            }));

          (mapRef.current as any).fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading notes: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        initialRegion={{
          latitude: 37.33,
          longitude: -122,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {notes.map(
          (note) =>
            note.location && (
              <Marker
                key={note.id}
                coordinate={{
                  latitude: note.location.latitude,
                  longitude: note.location.longitude,
                }}
                title={note.title}
                description={note.body}
              >
                <Callout>
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 24 }}>{note.title}</Text>
                  </View>
                </Callout>
              </Marker>
            )
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
