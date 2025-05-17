import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useLista } from '../context/ListaContext';

export default function FormularioAdicionarItem({ onAdicionar }) {
  const { itens } = useLista();

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState('un');
  const [compartilhar, setCompartilhar] = useState(false);
  const [emailCompartilhado, setEmailCompartilhado] = useState('');

  const handleAdd = () => {
    if (!nome.trim()) return alert('Informe o nome do produto.');
    if (quantidade <= 0) return alert('Quantidade inválida.');
    if (!unidade) return alert('Selecione a unidade.');

    const novoItem = { nome, marca, quantidade, unidade };

    onAdicionar({
      ...novoItem,
      compartilhadoCom: compartilhar ? emailCompartilhado.trim().toLowerCase() : null,
    });

    setNome('');
    setMarca('');
    setQuantidade(1);
    setUnidade('un');
    setCompartilhar(false);
    setEmailCompartilhado('');
  };

  const handleCompartilhar = async () => {
    if (!emailCompartilhado.trim()) return alert('Informe o e-mail de destino.');
    const emailDestino = emailCompartilhado.trim().toLowerCase();

    const itensPendentes = itens.filter((item) => !item.comprado);

    if (itensPendentes.length === 0) {
      alert('Não há itens para compartilhar.');
      return;
    }

    try {
      const ref = collection(db, 'listas_compartilhadas', emailDestino, 'itens');
      for (const item of itensPendentes) {
        const { nome, marca, quantidade, unidade } = item;
        await addDoc(ref, { nome, marca, quantidade, unidade });
      }
      alert(`✅ ${itensPendentes.length} item(ns) compartilhado(s) com ${emailDestino}`);
    } catch (error) {
      console.error('Erro ao compartilhar lista:', error);
      alert('❌ Ocorreu um erro ao compartilhar a lista.');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
        <input
          className="col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          className="col-span-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <div className="col-span-1 flex items-center gap-2">
          <input
            type="number"
            min={1}
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-20"
            placeholder="Qtd"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
          <select
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          >
            <option value="un">un</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">L</option>
            <option value="ml">ml</option>
            <option value="pct">Pct</option>
          </select>
        </div>
        <button
          className="bg-green-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-green-700 transition duration-300 col-span-1"
          onClick={handleAdd}
        >
          ➕ Adicionar
        </button>
      </div>

      {/* 🔄 Compartilhamento com botão discreto ao lado */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={compartilhar}
            onChange={(e) => setCompartilhar(e.target.checked)}
          />
          Compartilhar com outro usuário
        </label>

        {compartilhar && (
          <>
            <input
              type="email"
              className="border border-gray-300 p-2 rounded shadow-sm w-64"
              placeholder="E-mail de quem vai receber"
              value={emailCompartilhado}
              onChange={(e) => setEmailCompartilhado(e.target.value)}
            />
            <button
              className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
              onClick={handleCompartilhar}
            >
              📤 Compartilhar
            </button>
          </>
        )}
      </div>
    </>
  );
}
