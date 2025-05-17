import React, { createContext, useContext, useEffect, useState } from 'react';
import { observarUsuario } from '../firebase/auth';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import {
  solicitarPermissaoENotificar,
  escutarMensagensRecebidas
} from '../firebase/firebase-messaging';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = observarUsuario(async (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCarregando(false);

      if (usuarioFirebase) {
        // ⏰ Verifica tempo de sessão
        const dataLoginStr = localStorage.getItem('dataHoraLogin');
        if (dataLoginStr) {
          const dataLogin = new Date(dataLoginStr);
          const agora = new Date();
          const duracao = agora - dataLogin;
          const DURACAO_MAXIMA = 24 * 60 * 60 * 1000; // 24h

          if (duracao > DURACAO_MAXIMA) {
            console.warn('⚠️ Sessão expirada automaticamente.');
            localStorage.removeItem('dataHoraLogin');
            window.location.href = '/login';
            return;
          }
        }

        // 🚀 Solicita permissão e registra token FCM
        const token = await solicitarPermissaoENotificar();

        if (token) {
          await setDoc(doc(db, 'tokens_push', usuarioFirebase.uid), {
            uid: usuarioFirebase.uid,
            email: usuarioFirebase.email,
            token: token,
            atualizadoEm: new Date().toISOString(),
          });
        }

        // 👂 Listener de mensagens recebidas com app aberto
        escutarMensagensRecebidas((payload) => {
          alert(payload.notification?.title + '\n' + payload.notification?.body);
        });
      }
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
