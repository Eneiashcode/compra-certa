import React, { useState } from 'react';
import { useLista } from '../context/ListaContext';

export default function Home() {
  const { itens, toggleItem, adicionarItem, excluirItem, editarItem } = useLista();
  const [novoProduto, setNovoProduto] = useState('');
  const [novaMarca, setNovaMarca] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState(1);

  const handleAdd = () => {
    if (novoProduto.trim()) {
      adicionarItem({ nome: novoProduto, marca: novaMarca, quantidade: novaQuantidade });
      setNovoProduto('');
      setNovaMarca('');
      setNovaQuantidade(1);
    }
  };

  const handleEditar = (item) => {
    const novoNome = prompt('Novo nome do produto:', item.nome);
    if (!novoNome) return;

    const novaMarca = prompt('Nova marca:', item.marca);
    if (novaMarca === null) return;

    const novaQtd = prompt('Nova quantidade:', item.quantidade);
    const qtdConvertida = parseInt(novaQtd);

    editarItem(item.id, {
      nome: novoNome,
      marca: novaMarca,
      quantidade: !isNaN(qtdConvertida) ? qtdConvertida : item.quantidade,
    });
  };

  const itensPendentes = itens.filter((item) => !item.comprado);

  const total = itens.reduce((sum, item) => {
    if (item.preco && item.quantidade) {
      return sum + item.preco * item.quantidade;
    }
    return sum;
  }, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
        🛒 Compra Certa
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          className="col-span-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nome do Produto"
          value={novoProduto}
          onChange={(e) => setNovoProduto(e.target.value)}
        />
        <input
          className="col-span-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Marca"
          value={novaMarca}
          onChange={(e) => setNovaMarca(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="col-span-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Qtd"
          value={novaQuantidade}
          onChange={(e) => setNovaQuantidade(Number(e.target.value))}
        />
        <button
          className="bg-green-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-green-700 transition duration-300"
          onClick={handleAdd}
        >
          ➕ Adicionar
        </button>
      </div>

      <ul className="space-y-3">
        {itensPendentes.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-4 rounded-lg shadow-md transition-all duration-300 bg-gray-50"
          >
            <div className="w-full">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-lg">{item.nome}</strong>{' '}
                  <span className="text-sm text-gray-500">({item.marca})</span>
                  {item.preco > 0 && (
                    <span className="block text-green-700 font-semibold mt-1">
                      {(item.preco * (item.quantidade || 1)).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                      <span className="text-sm text-gray-500 ml-1">
                        ({item.quantidade}x{' '}
                        {item.preco.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })})
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-start ml-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => handleEditar(item)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm"
                    onClick={() => excluirItem(item.id)}
                    title="Excluir"
                  >
                    🗑️
                  </button>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-green-600 rounded"
                    checked={item.comprado}
                    onChange={() => {
                      const preco = prompt('Qual o preço pago?');
                      const supermercado = prompt('Nome do supermercado?');
                      toggleItem(item.id, preco, supermercado);
                    }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right text-xl font-bold text-green-800">
        Total Estimado:{' '}
        {total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}
      </div>
    </div>
  );
}
