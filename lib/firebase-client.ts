import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7I1XaUb1vELKH3jGrYEQM1L8H4v8tjgM",
  authDomain: "herbful-535e4.firebaseapp.com",
  databaseURL:
    "https://herbful-535e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "herbful-535e4",
  storageBucket: "herbful-535e4.firebasestorage.app",
  messagingSenderId: "12052868901",
  appId: "1:12052868901:web:765516a27e4e4ec3ad74cc",
  measurementId: "G-EGZYKD8HVZ",
};

// Initialize Firebase Client SDK
let clientApp: FirebaseApp | undefined;
let analytics: Analytics | null = null;

if (!getApps().length) {
  clientApp = initializeApp(firebaseConfig);

  // Initialize Analytics only on client-side (browser)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(clientApp);
      }
    });
  }
} else {
  clientApp = getApps()[0];
}

// Export database and storage instances
export const db = getDatabase(clientApp);
export const storage = getStorage(clientApp);
export { analytics };
export default clientApp;
