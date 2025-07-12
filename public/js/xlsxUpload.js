import { db } from './firebase.js';
import {
  collection, deleteDoc, getDocs, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

document.getElementById("btn-upload").addEventListener("click", async () => {
  const input = document.getElementById("input-xlsx");
  const msg = document.getElementById("msg-upload");
  if (!input.files.length) {
    msg.textContent = "Selecione um arquivo primeiro.";
    return;
  }

  const file = input.files[0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  for (const row of rows) {
    const cod = row.codigoProduto;
    const docRef = doc(db, "produtos", cod);
    await setDoc(docRef, {
      codigoProduto: cod,
      produto: row.produto,
      quantidade: row.quantidade,
      minimo: row.minimo,
      maximo: row.maximo,
      disponibilidade: row.disponibilidade,
      departamento: row.departamento,
      categoria: row.categoria,
      subCategoria: row.subCategoria,
      codigobarras: row.codigobarras || ""
    });
  }

  msg.textContent = "Base enviada com sucesso!";
});

document.getElementById("btn-excluir").addEventListener("click", async () => {
  const snap = await getDocs(collection(db, "produtos"));
  for (const docSnap of snap.docs) {
    await deleteDoc(docSnap.ref);
  }
  document.getElementById("msg-upload").textContent = "Base excluída.";
});
