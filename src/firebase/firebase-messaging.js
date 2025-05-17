// src/firebase/firebase-messaging.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 🔐 Importante: Substitua pelos seus dados reais do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDd3MblueVpI6860PGvGMpVz-8VyMthY_Y",
  authDomain: "compra-certa-ba543.firebaseapp.com",
  projectId: "compra-certa-ba543",
  storageBucket: "compra-certa-ba543.firebasestorage.app",
  messagingSenderId: "777052286978",
  appId: "1:777052286978:web:4e0108ca1451c84469f71b",
};

// 🟢 Inicializa o Firebase (evita duplicado em ambientes como Vite/React)
const app = initializeApp(firebaseConfig);

// 🔔 Inicializa o serviço de mensagens
const messaging = getMessaging(app);

// 📥 Solicita permissão e obtém o token do dispositivo
export const solicitarPermissaoENotificar = async () => {
  try {
    const status = await Notification.requestPermission();

    if (status === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BK2xg6GhnoyK2TJRxvBYfDWzP2ufOogrMvIGE78V-Bkuq5EwCuKz6-vyF6VIjhYZG9lcYygBTUo5lF-jpOAnRKw'
      });

      if (token) {
        console.log('✅ Token FCM:', token);
        return token;
      } else {
        console.warn('⚠️ Nenhum token disponível. Solicite permissão novamente.');
      }
    } else {
      console.warn('🚫 Permissão de notificação negada pelo usuário.');
    }
  } catch (err) {
    console.error('❌ Erro ao obter token FCM:', err);
  }
};

// 👂 Listener para mensagens recebidas com app aberto
export const escutarMensagensRecebidas = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('📨 Mensagem recebida em primeiro plano:', payload);
    callback(payload);
  });
};
