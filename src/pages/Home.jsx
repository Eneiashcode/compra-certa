import React, { useState } from 'react';
import { useLista } from '../context/ListaContext';
import SelecionarMercado from '../components/SelecionarMercado';
import ItemCompra from '../components/ItemCompra';
import TecladoNumerico from '../components/TecladoNumerico';

export default function Home() {
  const { itens, toggleItem, adicionarItem, excluirItem, editarItem } = useLista();
  const [novoProduto, setNovoProduto] = useState('');
  const [novaMarca, setNovaMarca] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState(1);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [mercadoAtual, setMercadoAtual] = useState('');
  const [mostrarTeclado, setMostrarTeclado] = useState(false);

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
        🛒 Minha Lista
      </h1>

      <SelecionarMercado mercadoAtual={mercadoAtual} setMercadoAtual={setMercadoAtual} />

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
          <ItemCompra
            key={item.id}
            item={item}
            onEditar={handleEditar}
            onExcluir={excluirItem}
            onMarcar={() => {
              setItemSelecionado(item);
              setMostrarTeclado(true);
            }}
          />
        ))}
      </ul>

      <div className="mt-6 text-right text-xl font-bold text-green-800">
        Total Estimado:{' '}
        {total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}
      </div>

      {mostrarTeclado && itemSelecionado && (
        <TecladoNumerico
          onConfirmar={(precoDigitado) => {
            toggleItem(itemSelecionado.id, precoDigitado.toString(), mercadoAtual || '');
            setMostrarTeclado(false);
            setItemSelecionado(null);
          }}
          onCancelar={() => {
            toggleItem(itemSelecionado.id, '0', mercadoAtual || '');
            setMostrarTeclado(false);
            setItemSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
