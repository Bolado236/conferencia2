import { db } from "./firebase.js";
import {
  collection, getDocs, query, where, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const usuarioAtual = "usuario1";

export async function buscarListaFiltrada(departamento, categoria, subCategoria) {
  const produtosRef = collection(db, "produtos");
  const contagensRef = collection(db, "contagens_1");
  const contagensSnap = await getDocs(contagensRef);

  const divergentes = {};
  contagensSnap.forEach(doc => {
    const data = doc.data();
    if (data.quantidade !== undefined && data.codigoProduto) {
      divergentes[data.codigoProduto] = data.quantidade;
    }
  });

  const snap = await getDocs(produtosRef);
  const lista = [];

  snap.forEach(doc => {
    const p = doc.data();
    if (
      p.departamento === departamento &&
      p.categoria === categoria &&
      p.subCategoria === subCategoria &&
      divergentes[p.codigoProduto] !== undefined
    ) {
      lista.push({
        codigoProduto: p.codigoProduto,
        produto: p.produto,
        contada: 0
      });
    }
  });

  return { ok: true, lista };
}

export async function contarProdutoNaLista(lista, codigoInput, quantidade) {
  const produto = lista.find(p =>
    p.codigoProduto === codigoInput ||
    (Array.isArray(p.codigobarras) && p.codigobarras.includes(codigoInput))
  );

  if (!produto) {
    return { ok: false, msg: "Produto não está na sua lista." };
  }

  try {
    const ref = doc(db, `contagens_2/${usuarioAtual}_${codigoInput}`);
    await setDoc(ref, {
      usuario: usuarioAtual,
      codigoProduto: codigoInput,
      quantidade: quantidade,
      timestamp: Date.now()
    });
    return { ok: true, msg: "Contagem registrada." };
  } catch {
    return { ok: false, msg: "Erro ao registrar contagem." };
  }
}
