import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Carrinho from './pages/Carrinho';
import Header from './components/Header';
import { ListaProvider } from './context/ListaContext';

export default function App() {
  return (
    <ListaProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 p-4">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrinho" element={<Carrinho />} />
        </Routes>
      </div>
    </ListaProvider>
  );
}
