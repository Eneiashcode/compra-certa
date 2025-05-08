import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <Link
            to="/"
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            Lista de Compras
          </Link>
          <Link
            to="/carrinho"
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            Itens no Carrinho
          </Link>
        </div>
      )}
    </div>
  );
}
