import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function RelatorioVariacoes() {
  const [variacoes, setVariacoes] = useState({ aumentos: [], quedas: [] });

  useEffect(() => {
    const carregarDados = async () => {
      const snapshot = await getDocs(collection(db, 'itens'));
      const comprados = snapshot.docs
        .map(doc => doc.data())
        .filter(item => item.comprado && item.preco > 0 && item.dataCompra);

      const agrupados = {};

      comprados.forEach((item) => {
        const chave = `${item.nome} - ${item.marca}`;
        if (!agrupados[chave]) agrupados[chave] = [];
        agrupados[chave].push({
          preco: item.preco,
          data: new Date(item.dataCompra),
          mercado: item.supermercado || ''
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
  }, []);

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

  const renderTabela = (titulo, dados) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-green-700 mb-2">{titulo}</h2>
      {dados.length === 0 ? (
        <p className="text-gray-500">Nenhuma variação identificada.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-4 py-2">Produto</th>
                <th className="px-4 py-2">De</th>
                <th className="px-4 py-2">Para</th>
                <th className="px-4 py-2">Variação</th>
                <th className="px-4 py-2">Mercado</th>
                <th className="px-4 py-2">Última Compra</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{item.produto}</td>
                  <td className="px-4 py-2">{formatarValor(item.precoAntigo)}</td>
                  <td className="px-4 py-2">{formatarValor(item.precoAtual)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      item.variacao > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {item.variacao.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2">{item.mercadoAtual || '-'}</td>
                  <td className="px-4 py-2">{formatarData(item.dataAtual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        📊 Relatório de Variações de Preço
      </h1>
      {renderTabela('🔺 Top 10 Maiores Aumentos', variacoes.aumentos)}
      {renderTabela('🔻 Top 10 Maiores Quedas', variacoes.quedas)}
    </div>
  );
}
