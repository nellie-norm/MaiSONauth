// Add this at the top of your component
console.log('Environment check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

import { useState } from 'react';
import { auth } from '../firebase-config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';
import { db } from '../firebase-config';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const getReadableErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
      setError(null);
    } catch (error: any) {
      setError(getReadableErrorMessage(error));
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string, email: string, username: string) => {
    try {
      // Store user profile
      await addDoc(collection(db, 'users'), {
        userId: userId,
        email: email,
        username: username,
        createdAt: Timestamp.now(),
      });

      // Separately create and store ID
      await addDoc(collection(db, 'ids'), {
        userId: userId,
        value: `ID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Timestamp.now(),
        active: true,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Password validation function
  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!hasNumber) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!hasLetter) {
      setPasswordError('Password must contain at least one letter');
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user.uid, email, username);
    } catch (error: any) {
      console.error('Error:', error);
      alert(getReadableErrorMessage(error));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error:', error);
      alert(getReadableErrorMessage(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      setError(null);
      if (isSignUp) {
        await handleSignUp(e);
      } else {
        await handleSignIn(e);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Example queries:

  // Get all users
  const getAllUsers = async () => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Search users by email
  const searchByEmail = async (email: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Get users created in last 24 hours
  const getRecentUsers = async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('createdAt', '>', yesterday));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Search by username
  const searchByUsername = async (username: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  if (isForgotPassword) {
    return (
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        {error && (
          <div
            style={{
              color: '#DC2626',
              backgroundColor: '#FEE2E2',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: '#059669',
              backgroundColor: '#D1FAE5',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            {success}
          </div>
        )}
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccc',
                width: '100%',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              width: '100%',
              maxWidth: '200px',
              marginBottom: '1rem',
            }}
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
        <button
          onClick={() => {
            setIsForgotPassword(false);
            setError(null);
            setSuccess(null);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#3B82F6',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
      {error && (
        <div
          style={{
            color: '#DC2626',
            backgroundColor: '#FEE2E2',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: '#059669',
            backgroundColor: '#D1FAE5',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
              width: '100%',
              marginBottom: '0.5rem',
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (isSignUp) {
                validatePassword(e.target.value);
              }
            }}
            placeholder="Password"
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
          {passwordError && isSignUp && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
          {isSignUp && !passwordError && password && (
            <p className="text-green-500 text-sm mt-1">Password meets requirements</p>
          )}
        </div>
        <div
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              flex: 1,
              maxWidth: '200px',
            }}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </form>
      {!isSignUp && (
        <button
          onClick={() => {
            setIsForgotPassword(true);
            setError(null);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#3B82F6',
            marginBottom: '1rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Forgot Password?
        </button>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          backgroundColor: '#DC2626',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          width: '100%',
          maxWidth: '200px',
        }}
      >
        {loading ? 'Processing...' : 'Sign in with Google'}
      </button>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3B82F6',
          marginTop: '1rem',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}

export default Login;
