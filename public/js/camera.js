import { BrowserMultiFormatReader } from "https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.12/+esm";

let codeReader = null;
let streamTrack = null;

export async function iniciarScanner(inputId) {
  const video = document.getElementById("video");
  const scannerContainer = document.getElementById("camera-scanner");

  scannerContainer.style.display = "block";
  codeReader = new BrowserMultiFormatReader();

  const devices = await codeReader.listVideoInputDevices();
  const deviceId = devices[0].deviceId;

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
  });
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