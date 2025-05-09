import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Login</h2>
      {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-3 rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Entrar
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Ainda não tem conta?{' '}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => navigate('/cadastro')}
        >
          Cadastre-se
        </span>
      </p>
    </div>
  );
}
