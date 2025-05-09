import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLista } from '../context/ListaContext';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { adicionarItem } = useLista();

  const carregarListaPadrao = () => {
    const confirmar = window.confirm('Deseja carregar a lista padrão de compras?');
    if (!confirmar) return;

    const itensPadrao = [
      { nome: 'Arroz', marca: 'Tio João', quantidade: 2 },
      { nome: 'Feijão', marca: 'Kicaldo', quantidade: 2 },
      { nome: 'Óleo de Soja', marca: 'Soya', quantidade: 1 },
      { nome: 'Papel Higiênico', marca: 'Personal', quantidade: 1 },
      { nome: 'Detergente', marca: 'Ypê', quantidade: 2 },
      { nome: 'Sabão em Pó', marca: 'Omo', quantidade: 1 },
      { nome: 'Café', marca: 'Pilão', quantidade: 1 },
      { nome: 'Macarrão', marca: 'Renata', quantidade: 2 }
    ];

    itensPadrao.forEach((item) => adicionarItem(item));
    setMenuAberto(false);
  };

  return (
    <div className="relative mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Compra Certa</h1>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-green-800 text-3xl"
        >
          ☰
        </button>
      </div>

      {menuAberto && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10">
          <Link
            to="/"
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            📝 Lista de Compras
          </Link>
          <Link
            to="/carrinho"
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            🛒 Itens no Carrinho
          </Link>
          <Link
            to="/minha-lista-padrao"
            className="block px-4 py-2 text-blue-700 hover:bg-blue-100"
            onClick={() => setMenuAberto(false)}
          >
            ⚙️ Gerenciar Lista Padrão
          </Link>
          <Link
            to="/relatorio-variacoes"
            className="block px-4 py-2 text-purple-700 hover:bg-purple-100"
            onClick={() => setMenuAberto(false)}
          >
            📊 Relatório de Variações
          </Link>
          <button
            onClick={carregarListaPadrao}
            className="w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-100 border-t border-gray-200"
          >
            🧾 Carregar Lista Padrão Agora
          </button>
        </div>
      )}
    </div>
  );
}
