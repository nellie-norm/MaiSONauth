import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './test-firebase';  // Change back to test-firebase
import Login from './components/Login';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {user ? (
        // User is signed in
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Welcome, {user.email}</h1>
          <button 
            onClick={() => auth.signOut()} 
            style={{ 
              backgroundColor: '#EF4444', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
          {/* Your authenticated app content goes here */}
        </div>
      ) : (
        // No user is signed in
        <Login />
      )}
    </div>
  );
}

export default App;