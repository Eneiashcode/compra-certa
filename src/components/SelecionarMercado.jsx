import React, { useEffect } from 'react';

export default function SelecionarMercado({ mercadoAtual, setMercadoAtual }) {
  // Carrega o valor salvo do localStorage ao montar o componente
  useEffect(() => {
    const salvo = localStorage.getItem('mercadoAtual');
    if (salvo) {
      setMercadoAtual(salvo);
    }
  }, [setMercadoAtual]);

  // Atualiza o valor e salva no localStorage sempre que mudar
  const handleChange = (e) => {
    const novoMercado = e.target.value;
    setMercadoAtual(novoMercado);
    localStorage.setItem('mercadoAtual', novoMercado);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-1">Mercado atual:</label>
      <input
        type="text"
        placeholder="Ex: Supermercado Boa Compra"
        className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        value={mercadoAtual}
        onChange={handleChange}
      />
    </div>
  );
}
