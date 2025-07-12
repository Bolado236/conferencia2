import {
  collection, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { db } from "./firebase.js";

document.getElementById("btn-reconciliacao").addEventListener("click", async () => {
  const contagensPorProduto = {};

  for (let i = 1; i <= 10; i++) {
    const coll = collection(db, `contagens_${i}`);
    const snap = await getDocs(coll);

    snap.forEach(doc => {
      const { codigoProduto, quantidade } = doc.data();
      if (!contagensPorProduto[codigoProduto]) {
        contagensPorProduto[codigoProduto] = {};
      }
      const mapa = contagensPorProduto[codigoProduto];
      mapa[quantidade] = (mapa[quantidade] || 0) + 1;
    });
  }

  const statusList = [];

  for (const codigoProduto in contagensPorProduto) {
    const mapa = contagensPorProduto[codigoProduto];
    const totalContagens = Object.values(mapa).reduce((a, b) => a + b, 0);
    const reconciliado = Object.values(mapa).some(qt => qt >= 2);

    statusList.push({
      codigoProduto,
      totalContagens,
      status: reconciliado ? "✅ Reconciliado" : "⏳ Ainda divergente"
    });
  }

  const ul = document.getElementById("lista-reconciliacao");
  ul.innerHTML = "";
  statusList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.codigoProduto} → ${item.status} (${item.totalContagens} contagens)`;
    ul.appendChild(li);
  });
});
