import { db } from './firebaseService'; // Ajusta si tu instancia de Firebase tiene otro nombre

export const customerService = {
  async addPoints(customerId, pointsToAdd) {
    const customerRef = db.collection('customers').doc(customerId);
    const customerDoc = await customerRef.get();
    if (!customerDoc.exists) return;

    const currentPoints = customerDoc.data().points || 0;
    console.log('Puntos actuales:', currentPoints, 'Puntos a sumar:', pointsToAdd); // <-- Depuración

    await customerRef.update({ points: currentPoints + pointsToAdd });
  }
};