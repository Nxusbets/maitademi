// Servicio para Nuestras Creaciones (CRUD)
// Requiere que tengas Firebase inicializado en otro archivo

import { db } from '../config/firebase'; // Corrige la ruta al archivo de configuración de Firebase
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const COLLECTION_NAME = 'creations';

export const creationService = {
  async getAll() {
    try {
      const ref = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },
  async create(data) {
    const ref = collection(db, COLLECTION_NAME);
    await addDoc(ref, data);
    return { success: true };
  },
  async update(id, data) {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, data);
    return { success: true };
  },
  async delete(id) {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
    return { success: true };
  }
};
