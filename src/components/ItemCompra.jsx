import React from 'react';

export default function ItemCompra({
  item,
  onEditar,
  onExcluir,
  onMarcar
}) {
  return (
    <li
      className="flex justify-between items-center p-4 rounded-lg shadow-md transition-all duration-300 bg-gray-50"
    >
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div>
            <strong className="text-lg">{item.nome}</strong>{' '}
            <span className="text-sm text-gray-500">({item.marca})</span>
            {item.preco > 0 && (
              <span className="block text-green-700 font-semibold mt-1">
                {(item.preco * (item.quantidade || 1)).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
                <span className="text-sm text-gray-500 ml-1">
                  ({item.quantidade}x{' '}
                  {item.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })})
                </span>
              </span>
            )}
          </div>
          <div className="flex gap-2 items-start ml-4">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => onEditar(item)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="text-red-600 hover:text-red-800 text-sm"
              onClick={() => onExcluir(item.id)}
              title="Excluir"
            >
              🗑️
            </button>
            <input
              type="checkbox"
              className="w-5 h-5 text-green-600 rounded"
              checked={item.comprado}
              onChange={() => onMarcar(item)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
