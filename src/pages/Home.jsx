import React, { useState } from 'react';
import { useLista } from '../context/ListaContext';
import SelecionarMercado from '../components/SelecionarMercado';
import TecladoNumerico from '../components/TecladoNumerico';
import FormularioAdicionarItem from '../components/FormularioAdicionarItem';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { itens, toggleItem, adicionarItem, excluirItem, editarItem } = useLista();
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [mercadoAtual, setMercadoAtual] = useState('');
  const [mostrarTeclado, setMostrarTeclado] = useState(false);
  const navigate = useNavigate();

  const itensPendentes = itens
    .filter((item) => !item.comprado)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const total = itens.reduce((sum, item) => {
    if (item.preco && item.quantidade) {
      return sum + item.preco * item.quantidade;
    }
    return sum;
  }, 0);

  const handleEditar = (item) => {
    const novoNome = prompt('Novo nome do produto:', item.nome);
    if (!novoNome) return;
    const novaMarca = prompt('Nova marca:', item.marca);
    if (novaMarca === null) return;
    const novaQtd = prompt('Nova quantidade:', item.quantidade);
    const qtdConvertida = parseInt(novaQtd);

    const novaUnidade = prompt('Nova unidade (ex: un, kg, l, ml, pct):', item.unidade || 'un');

    editarItem(item.id, {
      nome: novoNome,
      marca: novaMarca,
      quantidade: !isNaN(qtdConvertida) ? qtdConvertida : item.quantidade,
      unidade: novaUnidade || 'un',
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded mb-4 text-sm text-center">
        🚧 Este app está em fase de testes e melhorias contínuas. Sua experiência pode evoluir a qualquer momento!
      </div>

      <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center">
        🛒 Minha Lista
      </h1>

      {/* ✅ Dica para o usuário acessar o tutorial */}
      <div className="text-sm text-gray-500 text-center mb-4">
        ℹ️ Dica: Veja como usar o app em{' '}
        <span className="text-blue-600 underline cursor-pointer" onClick={() => navigate('/tutorial')}>
          📖 Tutorial
        </span>
        .
      </div>

      <SelecionarMercado mercadoAtual={mercadoAtual} setMercadoAtual={setMercadoAtual} />

      <FormularioAdicionarItem
        onAdicionar={(item) => {
          adicionarItem({
            nome: item.nome,
            marca: item.marca,
            quantidade: item.quantidade,
            unidade: item.unidade || 'un',
          });
        }}
      />

      <ul className="space-y-3 mt-6">
        {itensPendentes.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 rounded-lg shadow-md bg-gray-50">
            <div className="flex items-center">
              <span className="text-xl font-bold text-green-700 mr-3">
                {item.quantidade} {item.unidade || 'un'}
              </span>
              <div>
                <strong className="text-lg">{item.nome}</strong>{' '}
                <span className="text-sm text-gray-500">({item.marca})</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => handleEditar(item)}
                title="Editar"
              >
                ✏️
              </button>
              <button
                className="text-red-600 hover:text-red-800 text-sm"
                onClick={() => excluirItem(item.id)}
                title="Excluir"
              >
                🗑️
              </button>
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded"
                checked={item.comprado}
                onChange={() => {
                  setItemSelecionado(item);
                  setMostrarTeclado(true);
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right text-xl font-bold text-green-800">
        Total Estimado:{' '}
        {total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </div>

      {mostrarTeclado && itemSelecionado && (
        <TecladoNumerico
          onConfirmar={(precoDigitado) => {
            toggleItem(itemSelecionado.id, precoDigitado.toString(), mercadoAtual || '');
            setMostrarTeclado(false);
            setItemSelecionado(null);
          }}
          onCancelar={() => {
            toggleItem(itemSelecionado.id, '0', mercadoAtual || '');
            setMostrarTeclado(false);
            setItemSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
