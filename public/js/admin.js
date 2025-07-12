import { db } from "./firebase.js";
import {
  collection, addDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { processarArquivoXLSX } from "./conversor.js";

const form = document.getElementById("cadastro-form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("novo-usuario").value.trim();
  const senha = document.getElementById("nova-senha").value.trim();
  const tipo = document.getElementById("tipo-usuario").value;

  try {
    await addDoc(collection(db, "users"), { usuario, senha, tipo });
    msg.textContent = "Usuário cadastrado com sucesso!";
    msg.style.color = "green";
    form.reset();
  } catch (err) {
    console.error(err);
    msg.textContent = "Erro ao cadastrar.";
    msg.style.color = "red";
  }
});

// Envio de XLSX
document.getElementById("enviar-arquivo").addEventListener("click", async () => {
  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) {
    msg.textContent = "Escolha um arquivo XLSX primeiro.";
    return;
  }

  msg.textContent = "📤 Enviando...";
  try {
    await processarArquivoXLSX(fileInput.files[0]);
    msg.textContent = "✅ Base enviada com sucesso!";
  } catch (error) {
    console.error(error);
    msg.textContent = "❌ Erro ao processar o arquivo.";
  }
});
