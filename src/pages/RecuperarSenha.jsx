import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/auth'; // certifique-se de exportar `auth` no seu auth.js
import { useNavigate } from 'react-router-dom';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem('Um e-mail foi enviado com instruções para redefinir sua senha.');
    } catch (err) {
      console.error('Erro ao enviar e-mail de recuperação:', err.message);
      setErro('E-mail inválido ou não cadastrado.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-4">🔒 Recuperar Senha</h2>

      <form onSubmit={handleRecuperar} className="space-y-4">
        <input
          type="email"
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          Enviar Instruções
        </button>
      </form>

      {mensagem && <p className="text-green-700 mt-4 text-sm text-center">{mensagem}</p>}
      {erro && <p className="text-red-600 mt-4 text-sm text-center">{erro}</p>}

      <div className="mt-6 text-center">
        <button
          className="text-green-600 underline hover:text-green-800 text-sm"
          onClick={() => navigate('/login')}
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
}
