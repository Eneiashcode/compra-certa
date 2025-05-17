/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// 🔁 Configure com seus dados do Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDd3MblueVpI6860PGvGMpVz-8VyMthY_Y",
  authDomain: "compra-certa-ba543.firebaseapp.com",
  projectId: "compra-certa-ba543",
  storageBucket: "compra-certa-ba543.firebasestorage.app",
  messagingSenderId: "777052286978",
  appId: "1:777052286978:web:4e0108ca1451c84469f71b",
});

// Inicializa o Firebase Messaging
const messaging = firebase.messaging();

// Exibe notificação mesmo com app fechado
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Mensagem recebida: ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png', // Ou outro ícone do seu app
  });
});
