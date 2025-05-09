import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Função para criar conta
export const cadastrarUsuario = (email, senha) =>
  createUserWithEmailAndPassword(auth, email, senha);

// ✅ Função para login
export const login = (email, senha) =>
  signInWithEmailAndPassword(auth, email, senha);

// ✅ Função para logout
export const logout = () => signOut(auth);

// ✅ Escuta mudanças de autenticação
export const observarUsuario = (callback) => onAuthStateChanged(auth, callback);
