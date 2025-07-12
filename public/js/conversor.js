import { db } from "./firebase.js";
import {
  collection, setDoc, doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export async function processarArquivoXLSX(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const planilha = workbook.Sheets[workbook.SheetNames[0]];
      const dados = XLSX.utils.sheet_to_json(planilha);

      const produtosCol = collection(db, "produtos");

      for (const item of dados) {
        const cod = item.codigoProduto || item.produto;
        const codigos = typeof item.codigobarras === "string"
          ? item.codigobarras.split(";").map(c => c.trim())
          : [];
        const docData = {
          codigoProduto: cod,
          produto: item.produto || "",
          quantidade: item.quantidade || 0,
          minimo: item.minimo || 0,
          maximo: item.maximo || 0,
          disponibilidade: item.disponibilidade || "",
          departamento: item.departamento || "",
          categoria: item.categoria || "",
          subCategoria: item.subCategoria || "",
          codigobarras: codigos
        };
        await setDoc(doc(produtosCol, cod), docData);
      }

      resolve();
    };
    reader.onerror = reject;
  });
}
