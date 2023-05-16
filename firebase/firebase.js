// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC9lFMIRvq_poZfdCmWO6g_Dx7l1V9LWwk',
  authDomain: 'todo-crud-e6454.firebaseapp.com',
  projectId: 'todo-crud-e6454',
  storageBucket: 'todo-crud-e6454.appspot.com',
  messagingSenderId: '482161554898',
  appId: '1:482161554898:web:780ed26dbef8e52bcec40b',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
