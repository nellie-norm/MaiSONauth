import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

export function TestFirestore() {
  const testConnection = async () => {
    try {
      console.log('Testing Firestore connection...');

      // Try to read from your existing collection
      const querySnapshot = await getDocs(collection(db, 'MaiSON-auth'));
      console.log('Documents found:', querySnapshot.size);

      querySnapshot.forEach((doc) => {
        console.log('Document:', doc.id, doc.data());
      });

      alert(`Found ${querySnapshot.size} documents`);
    } catch (error: any) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
      });
      alert('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Firestore Test</h2>
      <button onClick={testConnection}>Read MaiSON-auth Collection</button>
    </div>
  );
}
