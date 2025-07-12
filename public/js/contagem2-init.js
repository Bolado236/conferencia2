import { iniciarScanner, pararScanner, alternarFlash } from "./camera.js";

document.getElementById("btn-scan").addEventListener("click", () => iniciarScanner("codigo"));
document.getElementById("btn-fechar").addEventListener("click", pararScanner);
document.getElementById("btn-flash").addEventListener("click", alternarFlash);
