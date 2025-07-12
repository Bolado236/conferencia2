import { db } from "./firebase.js";
import {
  collection, doc, getDocs, updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { iniciarScanner, pararScanner, alternarFlash } from "./camera.js";

const form = document.getElementById("form-contagem");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = form.codigo.value.trim();
  const qtd = Number(form.quantidadeContada.value);

  if (!codigo || isNaN(qtd) || qtd <= 0) return;

  try {
    const produtosRef = collection(db, "produtos");
    const q = query(produtosRef,
      where("codigoProduto", "==", codigo)
    );

    const snapshot = await getDocs(q);

    let found = false;

    snapshot.forEach(async (docSnap) => {
      found = true;
      const produtoRef = doc(db, "produtos", docSnap.id);
      await updateDoc(produtoRef, { quantidade: qtd });

      msg.textContent = "✅ Produto contado com sucesso!";
      msg.style.color = "green";

      setTimeout(() => { msg.textContent = ""; }, 2000);

      form.reset();
      form.codigo.focus();
    });

    if (!found) {
      msg.textContent = "❌ Produto não encontrado.";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Erro na contagem.";
  }
});

// Scanner de câmera
document.getElementById("btn-scan").addEventListener("click", () => iniciarScanner("codigo"));
document.getElementById("btn-fechar").addEventListener("click", pararScanner);
document.getElementById("btn-flash").addEventListener("click", alternarFlash);
