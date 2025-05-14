import React from 'react';
import { useLista } from '../context/ListaContext';

export default function Carrinho() {
  const { itens, excluirItem, editarItem, finalizarCompra, devolverItem } = useLista();

  const itensCarrinho = itens
    .filter((item) => item.comprado)
    .sort((a, b) => a.nome.localeCompare(b.nome)); // ✅ Agora ordenado por nome

  const totalCarrinho = itensCarrinho.reduce(
    (sum, item) => sum + (item.preco || 0) * (item.quantidade || 1),
    0
  );

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditar = (item) => {
    const novoPreco = prompt('Novo preço:', item.preco);
    if (novoPreco === null) return;

    const precoConvertido = parseFloat(novoPreco.replace(',', '.'));
    if (isNaN(precoConvertido)) return;

    const novaQtd = prompt('Nova quantidade:', item.quantidade);
    const qtdConvertida = parseInt(novaQtd);
    if (isNaN(qtdConvertida)) return;

    const novaUnidade = prompt('Nova unidade (ex: un, kg, l, ml, pct):', item.unidade || 'un');

    editarItem(item.id, {
      preco: precoConvertido,
      quantidade: qtdConvertida,
      unidade: novaUnidade || 'un',
    });
  };

  const handleFinalizarCompra = async () => {
    const confirmar = window.confirm('Deseja finalizar a compra atual? Os itens serão movidos para o histórico.');
    if (!confirmar) return;
    await finalizarCompra();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-green-800">🛒 Itens no Carrinho</h2>
        {itensCarrinho.length > 0 && (
          <button
            onClick={handleFinalizarCompra}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Finalizar Compra
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4 flex gap-4 items-center">
        <span>✏️ Editar</span>
        <span>↩️ Devolver</span>
        <span>🗑️ Excluir</span>
      </div>

      {itensCarrinho.length === 0 ? (
        <p className="text-gray-500">Nenhum item marcado ainda.</p>
      ) : (
        <ul className="space-y-3">
          {itensCarrinho.map((item) => (
            <li key={item.id} className="p-4 rounded-lg shadow-sm bg-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-700">
                      {item.quantidade} {item.unidade || 'un'}
                    </span>
                    <strong className="text-lg">{item.nome}</strong>
                    <span className="text-sm text-gray-600">({item.marca})</span>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    {item.preco?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}{' '}
                    ={' '}
                    <span className="font-semibold">
                      {(item.preco * item.quantidade).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                  {item.dataCompra && (
                    <div className="text-xs text-gray-500 mt-1">
                      Comprado em {formatarData(item.dataCompra)}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 ml-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg"
                    onClick={() => handleEditar(item)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-800 text-lg"
                    onClick={() => devolverItem(item.id)}
                    title="Devolver para Lista"
                  >
                    ↩️
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-lg"
                    onClick={() => excluirItem(item.id)}
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 text-right text-xl font-bold text-green-800">
        Total no Carrinho:{' '}
        {totalCarrinho.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}
      </div>
    </div>
  );
}
