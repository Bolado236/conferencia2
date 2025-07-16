window.iniciarScanner = function (inputId) {
  const container = document.getElementById("cameraContainer");
  container.style.display = "block";

  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: container.querySelector("#camera"),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    }
  }, function (err) {
    if (err) {
      console.error(err);
      alert("Erro ao iniciar câmera");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function (result) {
    const code = result.codeResult.code;
    Quagga.stop();
    Quagga.offDetected();
    container.style.display = "none";

    const input = document.getElementById(inputId);
    if (input) {
      input.value = code;
      input.focus();
    }
  });
};

window.fecharScanner = function () {
  Quagga.stop();
  document.getElementById("cameraContainer").style.display = "none";
};
