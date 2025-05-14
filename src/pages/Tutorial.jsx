import React from 'react';

export default function Tutorial() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-6 shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">📖 Como usar o App</h2>

      <div className="space-y-4 text-gray-700 text-sm">
        <div>
          <h3 className="font-bold text-green-600">🛒 Minha Lista</h3>
          <p>Adicione seus itens de compra com nome, marca, quantidade e unidade (un, kg, l, pct).</p>
          <p>Ao marcar como comprado, os itens vão automaticamente para o Carrinho.</p>
        </div>

        <div>
          <h3 className="font-bold text-green-600">🛍️ Itens no Carrinho</h3>
          <p>Itens comprados aparecem aqui.</p>
          <p>Você pode editar preço, devolver para lista ou excluir.</p>
          <p>Ao finalizar, os itens vão para o histórico de compras.</p>
        </div>

        <div>
          <h3 className="font-bold text-green-600">📋 Gerenciar Lista Padrão</h3>
          <p>Monte listas padrão para facilitar compras frequentes.</p>
          <p>Depois use o botão "Usar esta lista na compra atual" para carregar rapidamente.</p>
        </div>

        <div>
          <h3 className="font-bold text-green-600">📊 Relatório de Variações</h3>
          <p>Acompanhe a variação de preços dos produtos ao longo do tempo.</p>
          <p>Veja os itens que aumentaram ou diminuíram mais.</p>
        </div>

        <div>
          <h3 className="font-bold text-green-600">📥 Carregar Lista Padrão Agora</h3>
          <p>Na tela de "Minha Lista", use o botão para carregar sua Lista Padrão de forma rápida.</p>
        </div>
      </div>
    </div>
  );
}
