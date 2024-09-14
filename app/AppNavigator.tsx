import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LandingScreen from "../screens/LandingScreen";
import NoteScreen from "../screens/NoteScreen";
import MapScreen from "../screens/MapScreen";
import { auth } from "../config/firebase";

import { ActivityIndicator } from "react-native";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#3450a1",
        },
        headerTintColor: "#fff",

        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: string;
          if (route.name === "LandingScreen") {
            iconName = "list";
          } else if (route.name === "MapScreen") {
            iconName = "map";
          }
          return <Ionicons name={iconName} size={35} color={color} />;
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#041955",
      })}
    >
      <Tab.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{ title: "Notes" }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "Notes Markers" }}
      />
    </Tab.Navigator>
  );
};

const NoteStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NoteScreen"
        component={NoteScreen}
        options={{
          headerShown: true,
          title: "Edit Note",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#3450a1",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<{} | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //authentication state check
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <>{user ? <NoteStack /> : <AuthStack />}</>;
};

export default AppNavigator;
