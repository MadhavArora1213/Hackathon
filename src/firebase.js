
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth,createUserWithEmailAndPassword,GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB3VtFhA_U9Iz6eNH5IhbdX-fNw3q9ZRyQ",
  authDomain: "pmsss-72b05.firebaseapp.com",
  projectId: "pmsss-72b05",
  storageBucket: "pmsss-72b05.appspot.com",
  messagingSenderId: "487820078544",
  appId: "1:487820078544:web:075459eb42e8c1ae055dd5",
  databaseUrl: "https://pmsss-72b05-default-rtdb.firebaseio.com",
  measurementId: "G-GQMEY6KTFK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { auth,createUserWithEmailAndPassword, db ,storage};
