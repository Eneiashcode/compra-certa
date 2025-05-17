import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Perfil() {
  const { usuario } = useAuth();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario) return;

      const ref = doc(db, 'usuarios', usuario.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome || '');
        setTelefone(dados.telefone || '');
        setCep(dados.cep || '');
      }
      setCarregando(false);
    };
    carregarDados();
  }, [usuario]);

  const salvarPerfil = async () => {
    if (!usuario) return;
    const ref = doc(db, 'usuarios', usuario.uid);
    await setDoc(ref, { nome, telefone, cep }, { merge: true });
    alert('✅ Dados salvos com sucesso!');
  };

  if (carregando) {
    return <p className="text-center text-gray-500">Carregando perfil...</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">👤 Meu Perfil</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">E-mail:</label>
        <input
          type="email"
          value={usuario.email}
          disabled
          className="w-full p-3 border rounded bg-gray-100 text-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Opcional - Ex: João"
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Telefone:</label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Opcional - Ex: (11) 98765-4321"
          className="w-full p-3 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">CEP:</label>
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Opcional - Ex: 12345-678"
          className="w-full p-3 border rounded"
        />
      </div>

      <button
        onClick={salvarPerfil}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
      >
        💾 Salvar Perfil
      </button>
    </div>
  );
}
