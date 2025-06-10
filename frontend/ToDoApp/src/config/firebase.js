// Import Firebase services
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKuocW0s2XIkTnwgIcHppyiI6ywi9ev6w",
  authDomain: "clone-2a3bc.firebaseapp.com",
  projectId: "clone-2a3bc",
  storageBucket: "clone-2a3bc.appspot.com",
  messagingSenderId: "770208529783",
  appId: "1:770208529783:web:87d1bad75bbb8e77683572",
  measurementId: "G-7E621BZ98D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Uncomment these lines when you want to use Firebase emulators
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app; 