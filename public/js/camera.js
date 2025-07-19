window.iniciarScanner = function (inputId) {
  const container = document.getElementById("cameraContainer");
  container.style.display = "block";

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#camera"),
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
      alert("Erro ao iniciar scanner");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function (result) {
    const code = result.codeResult.code;
    document.getElementById(inputId).value = code;
    document.getElementById(inputId).focus();
    fecharScanner();
  });
};

window.fecharScanner = function () {
  Quagga.stop();
  document.getElementById("cameraContainer").style.display = "none";
};
