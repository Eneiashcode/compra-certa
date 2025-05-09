import React, { createContext, useContext, useEffect, useState } from 'react';
import { observarUsuario } from '../firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = observarUsuario((usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
