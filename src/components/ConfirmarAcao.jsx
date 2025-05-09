import React from 'react';

export default function ConfirmarAcao({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <p className="text-gray-800 text-lg mb-4">{mensagem}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Não
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
