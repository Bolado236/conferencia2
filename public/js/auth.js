import { db } from "./firebase.js";
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const form = document.getElementById("login-form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = form.usuario.value.trim();
  const senha = form.senha.value.trim();

  try {
    const q = query(collection(db, "users"),
      where("usuario", "==", usuario),
      where("senha", "==", senha)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      msg.style.color = "red";
      msg.textContent = "Credenciais inválidas.";
      return;
    }

    const docData = snapshot.docs[0].data();
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("tipo", docData.tipo || "usuario");
    window.location.href = "hub.html";
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.textContent = "Erro ao fazer login.";
  }
});
