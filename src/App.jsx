import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Carrinho from './pages/Carrinho';
import MinhaListaPadrao from './pages/MinhaListaPadrao';
import RelatorioVariacoes from './pages/RelatorioVariacoes';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import TelaInicial from './pages/TelaInicial';
import RecuperarSenha from './pages/RecuperarSenha'; // ✅ Novo
import Header from './components/Header';
import { ListaProvider } from './context/ListaContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function RotaPrivada({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="text-center text-gray-500 mt-10">Carregando...</p>;
  }

  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <ListaProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-4">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/inicio" />} />
            <Route path="/inicio" element={<TelaInicial />} />

            <Route
              path="/home"
              element={
                <RotaPrivada>
                  <Home />
                </RotaPrivada>
              }
            />
            <Route
              path="/carrinho"
              element={
                <RotaPrivada>
                  <Carrinho />
                </RotaPrivada>
              }
            />
            <Route
              path="/minha-lista-padrao"
              element={
                <RotaPrivada>
                  <MinhaListaPadrao />
                </RotaPrivada>
              }
            />
            <Route
              path="/relatorio-variacoes"
              element={
                <RotaPrivada>
                  <RelatorioVariacoes />
                </RotaPrivada>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} /> {/* ✅ Nova rota */}
          </Routes>
        </div>
      </ListaProvider>
    </AuthProvider>
  );
}
