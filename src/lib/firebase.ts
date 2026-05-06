import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlq5ZdPDV55Mw8JwQLFFwMAk7NsDirtVw",
  authDomain: "naimusim.firebaseapp.com",
  projectId: "naimusim",
  storageBucket: "naimusim.firebasestorage.app",
  messagingSenderId: "272186151092",
  appId: "1:272186151092:web:5e29e56def5f9b93cf87e1",
  measurementId: "G-N7B920YFFJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
