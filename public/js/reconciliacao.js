import { db } from "./firebase.js";
import {
  doc, getDocs, updateDoc, collection, query, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { iniciarScanner, pararScanner, alternarFlash } from "./camera.js";

const form = document.getElementById("form-reconciliacao");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = form.codigo.value.trim();
  const qtd = Number(form.quantidade.value);

  try {
    const q = query(collection(db, "produtos"),
      where("codigoProduto", "==", codigo)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      msg.textContent = "❌ Produto não encontrado.";
      msg.style.color = "red";
      return;
    }

    await updateDoc(doc(db, "produtos", snapshot.docs[0].id), {
      quantidade: qtd
    });

    msg.textContent = "✅ Reconciliação concluída.";
    msg.style.color = "green";
    form.reset();
    form.codigo.focus();
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Erro ao reconciliar.";
  }
});

// Scanner
document.getElementById("btn-scan").addEventListener("click", () => iniciarScanner("codigo"));
document.getElementById("btn-fechar").addEventListener("click", pararScanner);
document.getElementById("btn-flash").addEventListener("click", alternarFlash);
