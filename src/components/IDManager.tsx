import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

interface ID {
  id: string;
  value: string;
  createdAt: Timestamp;
  active: boolean;
}

export function IDManager() {
  const [ids, setIds] = useState<ID[]>([]);
  const [newId, setNewId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch IDs on component mount
  useEffect(() => {
    fetchIds();
  }, []);

  const fetchIds = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'ids'));
      const fetchedIds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ID[];
      setIds(fetchedIds);
    } catch (error) {
      console.error('Error fetching IDs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewId = async () => {
    if (!newId.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'ids'), {
        value: newId,
        createdAt: Timestamp.now(),
        active: true,
      });
      setNewId(''); // Clear input
      await fetchIds(); // Refresh list
    } catch (error) {
      console.error('Error adding ID:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ID Manager</h2>

      {/* Add new ID */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          placeholder="Enter new ID"
          className="border p-2 rounded"
          disabled={loading}
        />
        <button
          onClick={addNewId}
          disabled={loading || !newId.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add ID'}
        </button>
      </div>

      {/* List of IDs */}
      <div>
        <h3 className="font-semibold mb-2">Existing IDs:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {ids.map((id) => (
              <li key={id.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <span>{id.value}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${id.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {id.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Created: {id.createdAt.toDate().toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
