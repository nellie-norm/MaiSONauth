import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDg0ZrRMO7vAzjtcDWVxCVzDsAOwGsBkmY',
  authDomain: 'testauth-8c819.firebaseapp.com',
  projectId: 'testauth-8c819',
  storageBucket: 'testauth-8c819.firebasestorage.app',
  messagingSenderId: '349071992801',
  appId: '1:349071992801:web:45de9e18ee419fc63094a0',
  measurementId: 'G-XS1J1FKHDK',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('Test Firebase initialized:', !!app);
console.log('Test Auth instance created:', !!auth);

export { auth };

// console.log('Environment check:', {
//     VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
//     VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     length: import.meta.env.VITE_FIREBASE_API_KEY?.length
//   });

// // At the top of firebase.ts
// console.log('All env variables:', {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
//   });

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // import { getAnalytics } from "firebase/analytics";

// console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);

// // Load environment variables safely
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export default app;

// console.log("Firebase API Key in use:", import.meta.env.VITE_FIREBASE_API_KEY);
