import { db } from "./firebase.js";
import {
  collection, doc, writeBatch
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const input = document.getElementById("xlsx-to-firestore");
const button = document.getElementById("btn-converter-upload");
const msg = document.getElementById("msg-conversor");

// 👇 Elemento visual de progresso
const statusDiv = document.createElement("div");
statusDiv.id = "status-envio";
statusDiv.style.marginTop = "10px";
msg.insertAdjacentElement("afterend", statusDiv);

button.addEventListener("click", async () => {
  msg.textContent = "";
  statusDiv.textContent = "";

  if (!input.files.length) {
    msg.style.color = "red";
    msg.textContent = "Selecione um arquivo XLSX.";
    return;
  }

  try {
    const file = input.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let total = rows.length;
    let enviados = 0;
    let lote = writeBatch(db);

    for (let i = 0; i < total; i++) {
      const row = rows[i];
      const codigoProduto = row.codigoProduto?.toString().trim();
      if (!codigoProduto) continue;

      const ref = doc(db, "produtos", codigoProduto);
      lote.set(ref, {
        codigoProduto,
        produto: row.produto || "",
        quantidade: Number(row.quantidade || 0),
        minimo: Number(row.minimo || 0),
        maximo: Number(row.maximo || 0),
        disponibilidade: row.disponibilidade || "",
        departamento: row.departamento || "",
        categoria: row.categoria || "",
        subCategoria: row.subCategoria || "",
        codigobarras: typeof row.codigobarras === "string"
          ? row.codigobarras.split(";").map(c => c.trim()).filter(Boolean)
          : []
      });

      enviados++;

      // A cada 500 registros ou no último item, envia lote
      if (enviados % 500 === 0 || i === total - 1) {
        statusDiv.textContent = `⏳ Enviando ${enviados}/${total} registros...`;
        await lote.commit();
        lote = writeBatch(db); // inicia novo lote
      }
    }

    msg.style.color = "green";
    msg.textContent = "✅ Envio concluído com sucesso!";
    statusDiv.textContent = `Total de registros enviados: ${enviados}`;
  } catch (err) {
    console.error(err);
    msg.style.color = "red";
    msg.textContent = "❌ Erro ao processar ou enviar os dados.";
    statusDiv.textContent = "";
  }
});
