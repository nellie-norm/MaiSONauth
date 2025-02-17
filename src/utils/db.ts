import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

export async function getIDs() {
  const querySnapshot = await getDocs(collection(db, 'ids'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
