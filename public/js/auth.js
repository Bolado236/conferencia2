import { db, initDefaultAdmin } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

initDefaultAdmin();

// WARNING: Querying Firestore with plaintext password is insecure.
// It is recommended to use Firebase Authentication or hash passwords server-side.
// Storing session info in sessionStorage is vulnerable to XSS attacks.
// Consider using HttpOnly cookies or secure tokens for session management.

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value;

  const res = await login(usuario, senha);
  handleLoginResult(res, usuario);
});

async function login(usuario, senha) {
  const usersCol = collection(db, "users");
  const q = query(usersCol, where("usuario", "==", usuario), where("senha", "==", senha));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return { ok: false, msg: "Login inválido" };
  }
  // Get the tipo from the first matched document
  let tipo = null;
  snapshot.forEach(doc => {
    tipo = doc.data().tipo;
  });
  return { ok: true, tipo };
}

function handleLoginResult(res, usuario) {
  const msg = document.getElementById("feedback");
  if (res.ok) {
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("tipo", res.tipo);
    window.location.href = "hub.html";
  } else {
    msg.textContent = res.msg;
  }
}
