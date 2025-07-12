import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from "./firebase.js";

document.getElementById("btn-divergencias").addEventListener("click", async () => {
  const produtosSnap = await getDocs(collection(db, "produtos"));
  const contagensSnap = await getDocs(collection(db, "contagens_1"));

  const produtosMap = {};
  produtosSnap.forEach(doc => {
    const data = doc.data();
    produtosMap[data.codigoProduto] = data.quantidade;
  });

  const resultado = [];
  contagensSnap.forEach(doc => {
    const data = doc.data();
    const qtEstoque = produtosMap[data.codigoProduto] ?? 0;
    if (qtEstoque !== data.quantidade) {
      resultado.push({
        codigoProduto: data.codigoProduto,
        qtEstoque,
        qtContada: data.quantidade
      });
    }
  });

  const lista = document.getElementById("lista-divergencias");
  lista.innerHTML = "";
  resultado.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.codigoProduto} - Estoque: ${item.qtEstoque}, Contado: ${item.qtContada}`;
    lista.appendChild(li);
  });
});
