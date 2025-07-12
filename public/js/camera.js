import { BrowserMultiFormatReader } from "https://cdn.jsdelivr.net/npm/@zxing/browser@0.18.6/esm/index.js";

let codeReader = null;
let streamTrack = null;

export async function iniciarScanner(inputId) {
  const video = document.getElementById("video");
  const scannerContainer = document.getElementById("camera-scanner");

  scannerContainer.style.display = "block";
  codeReader = new BrowserMultiFormatReader();

  try {
    const devices = await codeReader.listVideoInputDevices();
    // Prefer rear camera if available
    let deviceId = devices.find(device => /back|rear|environment/gi.test(device.label))?.deviceId;
    if (!deviceId && devices.length > 0) {
      deviceId = devices[0].deviceId;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
    streamTrack = stream.getVideoTracks()[0];
    video.srcObject = stream;

    codeReader.decodeFromVideoDevice(deviceId, video, (result, err) => {
      if (result) {
        const input = document.getElementById(inputId);
        input.value = result.getText();
        pararScanner();
        input.focus();
      }
      if (err && !(err.name === 'NotFoundException')) {
        console.error(err);
      }
    });
  } catch (error) {
    console.error("Erro ao acessar a câmera: ", error);
    alert("Não foi possível acessar a câmera. Verifique as permissões e tente novamente.");
    pararScanner();
  }
}

export function pararScanner() {
  const scannerContainer = document.getElementById("camera-scanner");
  scannerContainer.style.display = "none";

  if (codeReader) codeReader.reset();
  if (streamTrack) streamTrack.stop();
}

export function alternarFlash() {
  if (!streamTrack) return;
  const capabilities = streamTrack.getCapabilities();
  if (capabilities.torch) {
    const current = streamTrack.getSettings().torch || false;
    streamTrack.applyConstraints({ advanced: [{ torch: !current }] });
  }
}
