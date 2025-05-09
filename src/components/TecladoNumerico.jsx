import React, { useState } from 'react';

export default function TecladoNumerico({ onConfirmar, onCancelar }) {
  const [valor, setValor] = useState('');

  const adicionarDigito = (digito) => {
    if (digito === '.' && valor.includes('.')) return;
    setValor((prev) => prev + digito);
  };

  const apagar = () => {
    setValor((prev) => prev.slice(0, -1));
  };

  const confirmar = () => {
    const convertido = parseFloat(valor.replace(',', '.'));
    if (!isNaN(convertido)) {
      onConfirmar(convertido);
    } else {
      onConfirmar(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-72">
        <h2 className="text-lg font-bold mb-2 text-center">Digite o preço pago:</h2>
        <div className="text-center text-2xl font-mono border p-2 mb-4 rounded bg-gray-100">
          {valor || '0'}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              className="bg-green-100 hover:bg-green-200 text-xl font-bold py-2 rounded"
              onClick={() => adicionarDigito(n.toString())}
            >
              {n}
            </button>
          ))}
          <button
            className="bg-gray-100 hover:bg-gray-200 text-xl font-bold py-2 rounded"
            onClick={() => adicionarDigito('0')}
          >
            0
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-xl font-bold py-2 rounded"
            onClick={() => adicionarDigito('.')}
          >
            .
          </button>
          <button
            className="bg-red-100 hover:bg-red-200 text-xl font-bold py-2 rounded"
            onClick={apagar}
          >
            ⌫
          </button>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded font-semibold"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            onClick={confirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
