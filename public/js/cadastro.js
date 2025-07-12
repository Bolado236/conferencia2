import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.getElementById("cadastro-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;
  const tipo = document.getElementById("tipo").value;

  try {
    await addDoc(collection(db, "users"), { usuario, senha, tipo });
    alert("Usuário cadastrado com sucesso!");
    window.location.href = "login.html";
  } catch (err) {
    document.getElementById("feedback").textContent = "Erro ao cadastrar.";
  }
});
