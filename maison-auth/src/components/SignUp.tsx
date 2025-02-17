import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  preferences: {
    emailUpdates: boolean;
    smsUpdates: boolean;
  }
}

export const signUpUser = async (userData: SignUpData) => {
  try {
    // 1. Create auth account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    // 2. Store additional user data in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      preferences: userData.preferences,
      createdAt: new Date()
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error in signup:', error);
    throw error;
  }
};