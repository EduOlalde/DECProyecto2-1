const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const detenerReconocimientoButton = document.getElementById("detenerReconocimiento");
const cameraSelect = document.getElementById("cameraSelect");

let currentStream = null;
let modelo = null;
let deteccionActiva = false;
let deteccionIntervalo = null;

// 🔹 Detener la cámara actual
function pararVideo() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
}

// 🔹 Iniciar la cámara con el dispositivo seleccionado
async function iniciarVideo(deviceId = null) {
  pararVideo(); // Asegura que no haya otra cámara activa

  if (!deviceId) {
    console.error("No se ha seleccionado un dispositivo de cámara válido.");
    return;
  }

  const constraints = {
    video: { deviceId: { exact: deviceId } }
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;

    // Esperar a que los metadatos estén cargados antes de reproducir
    video.onloadedmetadata = () => {
      video.play().catch(error => console.error("Error al reproducir el video:", error));
    };

    video.style.display = "none"; // 🔴 Ocultar el video (solo lo usamos como fuente)
  } catch (error) {
    console.error("Error al iniciar la cámara:", error);
    alert("No se pudo acceder a la cámara.");
  }
}


// 🔹 Detectar objetos en la cámara
async function detectarObjetos() {
  if (deteccionActiva) return; // Evita múltiples inicios

  modelo = await cocoSsd.load();
  iniciarVideo(cameraSelect.value); // Usa la cámara seleccionada

  deteccionActiva = true;
  detenerReconocimientoButton.style.display = "inline-block";

  video.addEventListener("loadeddata", () => {
    deteccionIntervalo = setInterval(async () => {
      if (!deteccionActiva) return;

      // 🛑 Verificar que el video tiene dimensiones válidas
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }

      // 🔴 Limpiar el canvas antes de dibujar el nuevo frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 🔵 Dibujar el video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 🔵 Obtener predicciones
      try {
        const predictions = await modelo.detect(video);

        // 🔴 Dibujar las cajas de detección
        predictions.forEach(prediction => {
          context.beginPath();
          context.rect(...prediction.bbox);
          context.lineWidth = 2;
          context.strokeStyle = "red";
          context.fillStyle = "red";
          context.stroke();
          context.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
          );
        });
      } catch (error) {
        console.error("Error al detectar objetos:", error);
      }
    }, 100);
  });
}


// 🔹 Detener la detección y liberar la cámara completamente
function detenerReconocimiento() {
  deteccionActiva = false;
  clearInterval(deteccionIntervalo);
  context.clearRect(0, 0, canvas.width, canvas.height);
  video.pause();
  pararVideo(); // 🔴 Detiene la cámara

  // Ocultar la sección y reactivar el botón de inicio
  document.getElementById("tensorflowSection").style.display = "none";
  document.getElementById("mostrarTensorFlow").disabled = false;
}

// 🔹 Comprobar cámaras disponibles
async function comprobarCamaras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === "videoinput");

    if (videoInputs.length === 0) return false;

    cameraSelect.innerHTML = ""; // Limpiar opciones

    videoInputs.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label || `Cámara ${index + 1}`;
      cameraSelect.appendChild(option);
    });

    // Seleccionar automáticamente la primera cámara disponible
    if (videoInputs.length > 0) {
      cameraSelect.value = videoInputs[0].deviceId;
      iniciarVideo(cameraSelect.value);
    }

    return true;
  } catch (error) {
    console.error("Error al comprobar cámaras:", error);
    return false;
  }
}

// 🔹 Exportar funciones
export { detectarObjetos, comprobarCamaras, detenerReconocimiento, iniciarVideo };
