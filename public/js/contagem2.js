import { db } from "./firebase.js";
import {
  collection, query, where, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { iniciarScanner, pararScanner, alternarFlash } from "./camera.js";

const formFiltro = document.getElementById("form-filtro");
const formContagem = document.getElementById("form-contagem");
const lista = document.getElementById("lista-produtos");
const msg = document.getElementById("msg");
let produtosFiltrados = [];

formFiltro.addEventListener("submit", async (e) => {
  e.preventDefault();
  lista.innerHTML = "";
  produtosFiltrados = [];

  const d = formFiltro.departamento.value.trim();
  const c = formFiltro.categoria.value.trim();
  const s = formFiltro.subcategoria.value.trim();

  const q = query(collection(db, "produtos"),
    where("departamento", "==", d),
    where("categoria", "==", c),
    where("subCategoria", "==", s)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    data.id = docSnap.id;
    produtosFiltrados.push(data);

    lista.innerHTML += `
      <li>
        <strong>${data.codigoProduto}</strong> - ${data.produto}
        <br />Contado: ${data.quantidade || 0}
      </li>
    `;
  });

  if (produtosFiltrados.length > 0) {
    msg.textContent = "✅ Lista carregada.";
    msg.style.color = "green";
    formContagem.style.display = "block";
  } else {
    msg.textContent = "❌ Nenhum item encontrado.";
    msg.style.color = "red";
    formContagem.style.display = "none";
  }
});

formContagem.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = formContagem.codigo.value.trim();
  const qtd = Number(formContagem["quantidade-contada"].value);
  if (!codigo || isNaN(qtd) || qtd <= 0) return;

  const encontrado = produtosFiltrados.find(p => {
    const codigos = Array.isArray(p.codigobarras) ? p.codigobarras : [];
    return p.codigoProduto === codigo || codigos.includes(codigo);
  });

  if (!encontrado) {
    msg.textContent = "❌ Item fora da lista.";
    msg.style.color = "red";
    return;
  }

  try {
    await updateDoc(doc(db, "produtos", encontrado.id), {
      quantidade: qtd
    });
    msg.textContent = "✅ Contagem registrada.";
    msg.style.color = "green";
    formContagem.reset();
    formContagem.codigo.focus();
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Erro ao salvar.";
  }
});

// Scanner
document.getElementById("btn-scan").addEventListener("click", () => iniciarScanner("codigo"));
document.getElementById("btn-fechar").addEventListener("click", pararScanner);
document.getElementById("btn-flash").addEventListener("click", alternarFlash);
