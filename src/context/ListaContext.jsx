import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ListaContext = createContext();

export function ListaProvider({ children }) {
  const { usuario, carregando } = useAuth();
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (!usuario) return;

    const itensRef = collection(db, 'usuarios', usuario.uid, 'itens');

    const unsubscribe = onSnapshot(itensRef, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItens(dados);
    });

    return () => unsubscribe();
  }, [usuario]);

  const adicionarItem = async ({ nome, marca, quantidade }) => {
    if (!usuario) return;

    try {
      const ref = collection(db, 'usuarios', usuario.uid, 'itens');
      await addDoc(ref, {
        nome,
        marca,
        quantidade: parseInt(quantidade) || 1,
        comprado: false,
        preco: 0,
        supermercado: '',
        dataCompra: null
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const toggleItem = async (id, preco, supermercado) => {
    if (!usuario) return;

    try {
      const precoNumerico = parseFloat(preco.replace(',', '.'));
      const ref = doc(db, 'usuarios', usuario.uid, 'itens', id);

      await updateDoc(ref, {
        comprado: true,
        preco: precoNumerico,
        supermercado: supermercado,
        dataCompra: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao marcar item como comprado:', error);
    }
  };

  const excluirItem = async (id) => {
    if (!usuario) return;

    try {
      const ref = doc(db, 'usuarios', usuario.uid, 'itens', id);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const editarItem = async (id, novosDados) => {
    if (!usuario) return;

    try {
      const ref = doc(db, 'usuarios', usuario.uid, 'itens', id);
      await updateDoc(ref, novosDados);
    } catch (error) {
      console.error('Erro ao editar item:', error);
    }
  };

  return (
    <ListaContext.Provider
      value={{ itens, adicionarItem, toggleItem, excluirItem, editarItem }}
    >
      {children}
    </ListaContext.Provider>
  );
}

export const useLista = () => useContext(ListaContext);
