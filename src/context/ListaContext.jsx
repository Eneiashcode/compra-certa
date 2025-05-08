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

const ListaContext = createContext();

export function ListaProvider({ children }) {
  const [itens, setItens] = useState([]);
  const itensRef = collection(db, 'itens');

  // 🔄 Escuta alterações em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(itensRef, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItens(dados);
    });

    return () => unsubscribe();
  }, []);

  // ➕ Adiciona item ao Firestore
  const adicionarItem = async ({ nome, marca, quantidade }) => {
    try {
      await addDoc(itensRef, {
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

  // ✅ Atualiza como comprado
  const toggleItem = async (id, preco, supermercado) => {
    try {
      const precoNumerico = parseFloat(preco.replace(',', '.'));

      const ref = doc(db, 'itens', id);
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

  // 🗑️ Excluir item
  const excluirItem = async (id) => {
    try {
      const ref = doc(db, 'itens', id);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  // ✏️ Editar item
  const editarItem = async (id, novosDados) => {
    try {
      const ref = doc(db, 'itens', id);
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
