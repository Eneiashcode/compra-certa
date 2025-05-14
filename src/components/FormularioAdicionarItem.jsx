import React, { useState } from 'react';

export default function FormularioAdicionarItem({ onAdicionar }) {
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState('un');

  const handleAdd = () => {
    if (!nome.trim()) return alert('Informe o nome do produto.');
    if (quantidade <= 0) return alert('Quantidade inválida.');
    if (!unidade) return alert('Selecione a unidade.');

    onAdicionar({
      nome,
      marca,
      quantidade,
      unidade,
    });

    setNome('');
    setMarca('');
    setQuantidade(1);
    setUnidade('un');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <option value="pct">Pct</option> {/* ✅ Nova opção pacote */}
        </select>
      </div>
      <button
        className="bg-green-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-green-700 transition duration-300 col-span-1"
        onClick={handleAdd}
      >
        ➕ Adicionar
      </button>
    </div>
  );
}
