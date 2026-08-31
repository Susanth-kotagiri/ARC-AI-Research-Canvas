import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "rugged-method-qjlsj",
  appId: "1:657330682122:web:8d6e99921542c82ce8e2f3",
  apiKey: "AIzaSyAUF-ksBizjyUxg4e1t4RFLHpzOCL6bd7s",
  authDomain: "rugged-method-qjlsj.firebaseapp.com",
  storageBucket: "rugged-method-qjlsj.firebasestorage.app",
  messagingSenderId: "657330682122"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-remixremixairese-cb2d6e72-ad41-4dcd-9c8e-9aa873ffb638");

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = () => signOut(auth);
