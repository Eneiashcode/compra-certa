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

export default function MinhaListaPadrao() {
  const [itensPadrao, setItensPadrao] = useState([]);
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarItem } = useLista();

  const refPadrao = collection(db, 'listaPadrao');

  // 🔄 Carrega os itens da lista padrão ao abrir a tela
  const carregarListaPadrao = async () => {
    const snapshot = await getDocs(refPadrao);
    const dados = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setItensPadrao(dados);
  };

  useEffect(() => {
    carregarListaPadrao();
  }, []);

  const handleAdicionar = async () => {
    if (!nome.trim()) return;
    await addDoc(refPadrao, {
      nome,
      marca,
      quantidade: parseInt(quantidade) || 1
    });
    setNome('');
    setMarca('');
    setQuantidade(1);
    carregarListaPadrao();
  };

  const handleExcluir = async (id) => {
    await deleteDoc(doc(db, 'listaPadrao', id));
    carregarListaPadrao();
  };

  const copiarParaCompraAtual = () => {
    if (confirm('Deseja carregar esses itens para sua lista de compras atual?')) {
      itensPadrao.forEach((item) => {
        adicionarItem({
          nome: item.nome,
          marca: item.marca,
          quantidade: item.quantidade
        });
      });
      alert('Itens adicionados à sua lista de compras!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        🧾 Minha Lista Padrão
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Produto"
          className="col-span-1 border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Marca"
          className="col-span-1 border p-2 rounded"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <input
          type="number"
          min={1}
          placeholder="Qtd"
          className="col-span-1 border p-2 rounded"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAdicionar}
        >
          ➕ Adicionar
        </button>
      </div>

      {itensPadrao.length === 0 ? (
        <p className="text-gray-500">Sua lista padrão está vazia.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {itensPadrao.map((item) => (
            <li key={item.id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
              <div>
                <strong>{item.nome}</strong> <span className="text-sm text-gray-500">({item.marca})</span>{' '}
                - Qtd: {item.quantidade}
              </div>
              <button
                onClick={() => handleExcluir(item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

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
