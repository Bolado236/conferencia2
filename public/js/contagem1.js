import { db } from "./firebase.js";
import {
  collection, getDocs, query, where, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const usuarioAtual = "usuario1";

export async function buscarProduto(codigoInput) {
  const produtosRef = collection(db, "produtos");
  const q = query(produtosRef);
  const snapshot = await getDocs(q);

  for (let docSnap of snapshot.docs) {
    const prod = docSnap.data();
    const codigos = Array.isArray(prod.codigobarras)
      ? prod.codigobarras
      : typeof prod.codigobarras === "string"
        ? prod.codigobarras.split(";").map(c => c.trim())
        : [];
    if (prod.codigoProduto === codigoInput || codigos.includes(codigoInput)) {
      document.getElementById("produto-info").style.display = "block";
      document.getElementById("nome-produto").textContent = prod.produto;
      document.getElementById("codigo-produto").textContent = prod.codigoProduto;
      return { ok: true, produto: prod };
    }
  }

  return { ok: false, msg: "Produto não encontrado na base." };
}

export async function registrarContagem(codigoProduto, quantidadeContada) {
  try {
    const ref = doc(db, `contagens_1/${usuarioAtual}_${codigoProduto}`);
    await setDoc(ref, {
      usuario: usuarioAtual,
      codigoProduto,
      quantidade: quantidadeContada,
      timestamp: Date.now()
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, msg: "Erro ao registrar contagem." };
  }
}

document.getElementById("busca-produto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = document.getElementById("codigo").value.trim();
  await buscarProduto(codigo);
});

document.getElementById("form-contagem").addEventListener("submit", async (e) => {
  e.preventDefault();
  const qt = parseInt(document.getElementById("quantidade-contada").value);
  const codigo = document.getElementById("codigo-produto").textContent;
  const res = await registrarContagem(codigo, qt);
  const msg = document.getElementById("mensagem");

  if (res.ok) {
    msg.textContent = "Contagem registrada!";
    msg.style.color = "green";
    setTimeout(() => { msg.textContent = ""; }, 2000);

    document.getElementById("busca-produto").reset();
    document.getElementById("quantidade-contada").value = "";
    document.getElementById("codigo-produto").textContent = "";
    document.getElementById("nome-produto").textContent = "";
    document.getElementById("codigo").focus();
  } else {
    msg.textContent = res.msg;
    msg.style.color = "red";
  }
});

