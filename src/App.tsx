import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import Login from './components/Login';
import { IDManager } from './components/IDManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TestFirestore } from './components/TestFirestore';

const queryClient = new QueryClient();

// List of admin email addresses
const ADMIN_EMAILS = [
  'nellie.norman@gmail.com', // Add your admin email here
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>My App</h1>
        {/* Always show TestFirestore for debugging */}
        <TestFirestore />
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={() => auth.signOut()}>Sign Out</button>
            {/* Only show ID Manager to admins */}
            {isAdmin && <IDManager />}
          </div>
        ) : (
          <Login />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
