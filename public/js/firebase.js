import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALPpICr8nG7D7YVw823c2uBEo6avK0DPk",
  authDomain: "conferencia2-6fd96.firebaseapp.com",
  projectId: "conferencia2-6fd96",
  storageBucket: "conferencia2-6fd96.firebasestorage.app",
  messagingSenderId: "783116477412",
  appId: "1:783116477412:web:c20cffc30e23930e3bddf1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function initDefaultAdmin() {
  const usersCol = collection(db, "users");
  const q = query(usersCol,
    where("usuario", "==", "gabrieln"),
    where("tipo", "==", "admin")
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    await addDoc(usersCol, {
      usuario: "gabrieln",
      senha: "admin123",
      tipo: "admin"
    });
  }
}
