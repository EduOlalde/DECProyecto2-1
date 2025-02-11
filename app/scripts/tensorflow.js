const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const toggleCameraButton = document.getElementById('toggleCamera');

let currentStream;
let usarCamaraFrontal = true;
let modelo;

// Función para detener el stream de video actual
function pararVideo() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
}

// Función para iniciar el video con la cámara seleccionada
async function iniciarVideo(deviceId = null) {
  pararVideo();

  const constraints = {
    video: deviceId ? { deviceId: { exact: deviceId } } : true
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (error) {
    console.error("Error al iniciar la cámara:", error);
    alert("No se pudo acceder a la cámara.");
  }
}


// Función para cambiar entre la cámara frontal y trasera
toggleCameraButton.addEventListener('click', () => {
  usarCamaraFrontal = !usarCamaraFrontal;
  iniciarVideo();
});

// Función para cargar el modelo y realizar la detección de objetos
async function detectarObjetos() {
  modelo = await cocoSsd.load();
  iniciarVideo();

  video.addEventListener('loadeddata', () => {
    setInterval(async () => {
      // Dibujar el video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Detectar objetos en el video
      const predictions = await modelo.detect(video);

      // Dibujar predicciones
      predictions.forEach(prediction => {
        context.beginPath();
        context.rect(...prediction.bbox);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.fillStyle = 'red';
        context.stroke();
        context.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          prediction.bbox[0],
          prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
        );
      });
    }, 100);
  });
}


// Función para comprobar si hay cámaras disponibles
async function comprobarCamaras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === "videoinput");

    if (videoInputs.length === 0) return false;

    // Llenar un select con las cámaras detectadas
    const cameraSelect = $("#cameraSelect");
    cameraSelect.empty(); // Limpia el select antes de llenarlo

    videoInputs.forEach((device, index) => {
      const option = $("<option>")
        .val(device.deviceId)
        .text(device.label || `Cámara ${index + 1}`);
      cameraSelect.append(option);
    });

    return true;
  } catch (error) {
    console.error("Error al comprobar las cámaras:", error);
    return false;
  }
}

export { detectarObjetos, comprobarCamaras };