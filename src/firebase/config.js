import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "maitademi-project.firebaseapp.com",
  projectId: "maitademi-project",
  storageBucket: "maitademi-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id-aqui"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;