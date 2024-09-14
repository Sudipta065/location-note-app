import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { keys } from "@/constants/Keys";

const firebaseConfig = {
  apiKey: keys.API_KEY,
  authDomain: keys.AUTH_DOMAIN,
  projectId: keys.PROJECT_ID,
  storageBucket: keys.STORAGE_BUCKET,
  messagingSenderId: keys.MESSAGING_SENDER_ID,
  appId: keys.APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db, app };
