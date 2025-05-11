import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-compra-certa.png';

export default function TelaInicial() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex flex-col items-center justify-center text-center p-6">
      <img
        src={logo}
        alt="Logo Compra Certa"
        className="w-40 h-40 mb-6 animate-bounce"
      />
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Bem-vindo ao <span className="text-green-600">Compra Certa</span>
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Organize suas compras, controle seus gastos e compare preços com praticidade. Uma experiência inteligente para sua lista de mercado!
      </p>
      <button
        onClick={() => navigate('/home')} // ✅ redireciona corretamente agora
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
      >
        📝 Começar
      </button>
    </div>
  );
}
