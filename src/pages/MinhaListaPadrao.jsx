import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { useLista } from '../context/ListaContext';
import { useAuth } from '../context/AuthContext';
import FormularioAdicionarItem from '../components/FormularioAdicionarItem';

export default function MinhaListaPadrao() {
  const { usuario } = useAuth();
  const { adicionarItem } = useLista();
  const [itensPadrao, setItensPadrao] = useState([]);

  const refPadrao = collection(db, 'usuarios', usuario.uid, 'lista_padrao');

  const carregarListaPadrao = async () => {
    const snapshot = await getDocs(refPadrao);
    const dados = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome)); // ✅ Agora ordena por nome ao carregar
    setItensPadrao(dados);
  };

  useEffect(() => {
    if (usuario) {
      carregarListaPadrao();
    }
  }, [usuario]);

  const handleAdicionar = async (item) => {
    if (!item.nome.trim()) return;
    await addDoc(refPadrao, {
      nome: item.nome,
      marca: item.marca,
      quantidade: parseFloat(item.quantidade) || 1,
      unidade: item.unidade || 'un',
    });
    carregarListaPadrao();
  };

  const handleExcluir = async (id) => {
    await deleteDoc(doc(db, 'usuarios', usuario.uid, 'lista_padrao', id));
    carregarListaPadrao();
  };

  const copiarParaCompraAtual = () => {
    if (window.confirm('Deseja carregar esses itens para sua lista de compras atual?')) {
      itensPadrao.forEach((item) => {
        adicionarItem({
          nome: item.nome,
          marca: item.marca,
          quantidade: item.quantidade,
          unidade: item.unidade || 'un',
        });
      });
      alert('Itens adicionados à sua lista de compras!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        🧾 Gerenciar Lista Padrão
      </h2>

      <FormularioAdicionarItem
        onAdicionar={handleAdicionar}
      />

      {itensPadrao.length === 0 ? (
        <p className="text-gray-500">Sua lista padrão está vazia.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {itensPadrao.map((item) => (
            <li key={item.id} className="p-3 bg-gray-50 rounded flex justify-between items-center shadow-sm">
              <div>
                <strong>{item.nome}</strong>{' '}
                <span className="text-sm text-gray-500">({item.marca})</span>{' '}
                - Qtd: {item.quantidade} {item.unidade || 'un'}
              </div>
              <button
                onClick={() => handleExcluir(item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
                title="Excluir da lista padrão"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="text-right text-xs text-gray-500 mb-2">
        Os itens adicionados aqui serão salvos automaticamente como sua Lista Padrão.
      </div>

      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={copiarParaCompraAtual}
          disabled={itensPadrao.length === 0}
        >
          📥 Usar esta lista na compra atual
        </button>
      </div>
    </div>
  );
}
