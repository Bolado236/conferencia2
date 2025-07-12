import {
  collection, getDocs, query, where, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from "./firebase.js";

const usuarioAtual = "usuario1";

export async function registrarRecontagem(codigoProduto, quantidade) {
  const rodada = await proximaRodada(codigoProduto);
  const ref = doc(db, `contagens_${rodada}/${usuarioAtual}_${codigoProduto}`);
  await setDoc(ref, {
    usuario: usuarioAtual,
    codigoProduto,
    quantidade,
    timestamp: Date.now()
  });

  const reconciliado = await verificarReconcilia(codigoProduto);

  return reconciliado
    ? { ok: true, msg: `Contagem registrada e reconciliada com sucesso! (rodada ${rodada})` }
    : { ok: true, msg: `Contagem registrada. Aguardando consenso (rodada ${rodada}).` };
}

async function proximaRodada(codigoProduto) {
  let rodada = 3;
  while (true) {
    const coll = collection(db, `contagens_${rodada}`);
    const q = query(coll, where("codigoProduto", "==", codigoProduto));
    const snap = await getDocs(q);
    if (snap.size < 2) return rodada;
    rodada++;
  }
}

async function verificarReconcilia(codigoProduto) {
  const quantidades = {};

  for (let i = 1; i <= 10; i++) {
    const coll = collection(db, `contagens_${i}`);
    const q = query(coll, where("codigoProduto", "==", codigoProduto));
    const snap = await getDocs(q);

    snap.forEach(doc => {
      const qt = doc.data().quantidade;
      quantidades[qt] = (quantidades[qt] || 0) + 1;
    });
  }

  return Object.values(quantidades).some(count => count >= 2);
}
