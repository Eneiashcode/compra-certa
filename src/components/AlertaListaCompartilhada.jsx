import React, { useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useLista } from '../context/ListaContext';

export default function AlertaListaCompartilhada() {
  const { usuario } = useAuth();
  const { adicionarItem } = useLista();

  useEffect(() => {
    const verificarListaCompartilhada = async () => {
      if (!usuario?.email) return;

      const email = usuario.email.toLowerCase();
      const ref = collection(db, 'listas_compartilhadas', email, 'itens');
      const snapshot = await getDocs(ref);

      if (!snapshot.empty) {
        const desejaImportar = window.confirm(
          '📬 Você recebeu uma lista compartilhada. Deseja adicioná-la à sua lista de compras?'
        );

        if (desejaImportar) {
          snapshot.docs.forEach(async (docSnap) => {
            const dados = docSnap.data();

            // ✅ Adiciona na lista atual
            adicionarItem({
              nome: dados.nome,
              marca: dados.marca,
              quantidade: dados.quantidade,
              unidade: dados.unidade || 'un',
            });

            // ✅ Remove da lista compartilhada após importar
            await deleteDoc(doc(db, 'listas_compartilhadas', email, 'itens', docSnap.id));
          });

          alert('✅ Lista compartilhada adicionada com sucesso!');
        }
      }
    };

    verificarListaCompartilhada();
  }, [usuario, adicionarItem]);

  return null; // Não renderiza nada na tela
}
