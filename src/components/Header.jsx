import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLista } from '../context/ListaContext';
import { db } from '../firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { adicionarItem } = useLista();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const carregarListaPadraoDoUsuario = async () => {
    if (!usuario) return;

    const refPadrao = collection(db, 'usuarios', usuario.uid, 'lista_padrao');
    const snapshot = await getDocs(refPadrao);

    if (snapshot.empty) {
      alert('Sua lista padrão está vazia!');
      setMenuAberto(false);
      return;
    }

    snapshot.docs.forEach((doc) => {
      const item = doc.data();
      adicionarItem({
        nome: item.nome,
        marca: item.marca,
        quantidade: item.quantidade,
        unidade: item.unidade || 'un',
      });
    });

    alert('Lista Padrão carregada na sua lista de compras!');
    setMenuAberto(false);
  };

  const handleLogout = async () => {
    await logout();
    setMenuAberto(false);
    navigate('/login');
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
            to="/home"
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
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            ⚙️ Gerenciar Lista Padrão
          </Link>
          <Link
            to="/relatorio-variacoes"
            className="block px-4 py-2 text-green-700 hover:bg-green-100"
            onClick={() => setMenuAberto(false)}
          >
            📊 Relatório de Variações
          </Link>
          <Link
            to="/tutorial"
            className="block px-4 py-2 text-green-700 hover:bg-green-100 border-t border-gray-200"
            onClick={() => setMenuAberto(false)}
          >
            📖 Tutorial
          </Link>
          <a
            href="mailto:edias.dias@terra.com.br?subject=Dúvida ou Sugestão - Compra Certa"
            className="block px-4 py-2 text-green-700 hover:bg-green-100 border-t border-gray-200"
            onClick={() => setMenuAberto(false)}
          >
            📩 Suporte
          </a>
          <button
            onClick={carregarListaPadraoDoUsuario}
            className="w-full text-left px-4 py-2 text-green-700 hover:bg-green-100 border-t border-gray-200"
          >
            🧾 Carregar Lista Padrão Agora
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-green-700 hover:bg-green-100 border-t border-gray-200"
          >
            🚪 Sair
          </button>
        </div>
      )}
    </div>
  );
}
