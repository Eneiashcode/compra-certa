import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function RelatorioVariacoes() {
  const { usuario } = useAuth();
  const [variacoes, setVariacoes] = useState({ aumentos: [], quedas: [] });
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario) return;

      const ref = collection(db, 'usuarios', usuario.uid, 'historico_compras');
      const snapshot = await getDocs(ref);

      const todosItens = [];

      snapshot.docs.forEach((doc) => {
        const dataCompra = doc.data().data;
        const itens = doc.data().itens || [];

        itens.forEach((item) => {
          if (item.comprado && item.preco > 0) {
            todosItens.push({
              nome: item.nome,
              marca: item.marca,
              preco: item.preco,
              dataCompra: new Date(dataCompra),
              supermercado: item.supermercado || ''
            });
          }
        });
      });

      const agrupados = {};

      todosItens.forEach((item) => {
        const chave = `${item.nome} - ${item.marca}`;
        if (!agrupados[chave]) agrupados[chave] = [];
        agrupados[chave].push({
          preco: item.preco,
          data: item.dataCompra,
          mercado: item.supermercado
        });
      });

      const resultados = [];

      for (const produto in agrupados) {
        const historico = agrupados[produto].sort((a, b) => a.data - b.data);
        if (historico.length < 2) continue;

        const precoAntigo = historico[0].preco;
        const precoAtual = historico[historico.length - 1].preco;
        const mercadoAtual = historico[historico.length - 1].mercado;
        const dataAtual = historico[historico.length - 1].data;

        const variacao = ((precoAtual - precoAntigo) / precoAntigo) * 100;

        resultados.push({
          produto,
          precoAntigo,
          precoAtual,
          variacao,
          mercadoAtual,
          dataAtual
        });
      }

      const aumentos = resultados
        .filter(r => r.variacao > 0)
        .sort((a, b) => b.variacao - a.variacao)
        .slice(0, 10);

      const quedas = resultados
        .filter(r => r.variacao < 0)
        .sort((a, b) => a.variacao - b.variacao)
        .slice(0, 10);

      setVariacoes({ aumentos, quedas });
    };

    carregarDados();
  }, [usuario]);

  const formatarValor = (valor) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  const formatarData = (data) =>
    new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const renderResumo = (titulo, dados, tipo) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-green-700 mb-4">{titulo}</h2>
      {dados.length === 0 ? (
        <p className="text-gray-500">Nenhuma variação identificada.</p>
      ) : (
        <ul className="space-y-2">
          {dados.map((item, idx) => {
            const isAberto = expandido === `${tipo}-${idx}`;
            return (
              <li
                key={idx}
                className="bg-white shadow rounded p-4 cursor-pointer transition hover:bg-green-50"
                onClick={() =>
                  setExpandido(isAberto ? null : `${tipo}-${idx}`)
                }
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-800">{item.produto}</span>
                  <span
                    className={`text-sm font-bold ${
                      item.variacao > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {item.variacao > 0 ? '🔺' : '🔻'} {item.variacao.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-600">{formatarData(item.dataAtual)}</span>
                </div>

                {isAberto && (
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <div>De: {formatarValor(item.precoAntigo)}</div>
                    <div>Para: {formatarValor(item.precoAtual)}</div>
                    <div>Mercado: {item.mercadoAtual || '-'}</div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        📊 Relatório de Variações de Preço
      </h1>
      {renderResumo('🔺 Top 10 Maiores Aumentos', variacoes.aumentos, 'aumento')}
      {renderResumo('🔻 Top 10 Maiores Quedas', variacoes.quedas, 'queda')}
    </div>
  );
}
