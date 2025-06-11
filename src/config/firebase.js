import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBuKrpF5QFyJ2o-kOJq2B5s7VFj2YjN9bM", // Tu API key real
  authDomain: "maitademi-project.firebaseapp.com",
  projectId: "maitademi-project", // Tu project ID real
  storageBucket: "maitademi-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456" // Tu app ID real
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;