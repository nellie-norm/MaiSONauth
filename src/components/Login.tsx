// Add this at the top of your component
console.log('Environment check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

import { useState } from 'react';
// Import auth from our test configuration instead of the main one
import { auth } from '../test-firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const getReadableError = (error: AuthError) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'This sign in method is not enabled. Please contact support.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Sign in popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Try again or click "Forgot Password"';
      default:
        return error.message || 'An error occurred. Please try again.';
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
      setError(getReadableError(error));
      setSuccess(null);
    } finally {
      setLoading(false);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
          setSuccess('Account created! Please check your email to verify your account.');
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(getReadableError(error));
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
      setError(getReadableError(error));
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
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
