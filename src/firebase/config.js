import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd3MblueVpI6860PGvGMpVz-8VyMthY_Y",
  authDomain: "compra-certa-ba543.firebaseapp.com",
  projectId: "compra-certa-ba543",
  storageBucket: "compra-certa-ba543.firebasestorage.app",
  messagingSenderId: "777052286978",
  appId: "1:777052286978:web:4e0108ca1451c84469f71b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
