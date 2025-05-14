import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ListaContext = createContext();

export function ListaProvider({ children }) {
  const { usuario } = useAuth();
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

  const adicionarItem = async ({ nome, marca, quantidade, unidade }) => {
    if (!usuario) return;

    try {
      const ref = collection(db, 'usuarios', usuario.uid, 'itens');
      await addDoc(ref, {
        nome,
        marca,
        quantidade: parseInt(quantidade) || 1,
        unidade: unidade || 'un', // ✅ Agora grava corretamente a unidade
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

  const devolverItem = async (id) => {
    if (!usuario) return;

    try {
      const ref = doc(db, 'usuarios', usuario.uid, 'itens', id);
      await updateDoc(ref, {
        comprado: false,
        preco: 0,
        supermercado: '',
        dataCompra: null
      });
    } catch (error) {
      console.error('Erro ao devolver item para a lista:', error);
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

  const finalizarCompra = async () => {
    if (!usuario) return;

    try {
      const itensRef = collection(db, 'usuarios', usuario.uid, 'itens');
      const snapshot = await getDocs(query(itensRef, where('comprado', '==', true)));

      const itensComprados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      if (itensComprados.length === 0) return;

      const historicoRef = collection(db, 'usuarios', usuario.uid, 'historico_compras');
      await addDoc(historicoRef, {
        data: new Date().toISOString(),
        itens: itensComprados
      });

      for (const item of itensComprados) {
        await deleteDoc(doc(db, 'usuarios', usuario.uid, 'itens', item.id));
      }

      console.log('✅ Compra finalizada e salva com sucesso!');
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
    }
  };

  return (
    <ListaContext.Provider
      value={{
        itens,
        adicionarItem,
        toggleItem,
        excluirItem,
        editarItem,
        finalizarCompra,
        devolverItem
      }}
    >
      {children}
    </ListaContext.Provider>
  );
}

export const useLista = () => useContext(ListaContext);
