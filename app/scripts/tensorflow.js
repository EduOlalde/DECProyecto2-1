'use strict';

import * as videoModule from "./video.js";

const canvas = $("#canvas")[0];
const context = canvas.getContext("2d");
const video = $("#video")[0];
const detenerReconocimientoButton = $("#detenerReconocimiento");

let modelo = null;
let deteccionActiva = false;
let deteccionIntervalo = null;

/**
 * Detección de objetos mediante TensorFlow
 */
async function detectarObjetos() {
  if (deteccionActiva) return; // Evita múltiples inicios

  modelo = await cocoSsd.load();
  videoModule.iniciarVideo($("#cameraSelect").val()); // Usa la cámara seleccionada

  deteccionActiva = true;
  detenerReconocimientoButton.show();

  $(video).on("loadeddata", function () {
    deteccionIntervalo = setInterval(async () => {
      if (!deteccionActiva) return;

      // Verificar que el video tiene dimensiones válidas
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      // Limpiar el canvas antes de dibujar el nuevo frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obtener predicciones
      try {
        const predictions = await modelo.detect(video);

        // Dibujar las cajas de detección
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

/**
 * Detiene el reconocimiento de objetos y libera la cámara
 */
function detenerReconocimiento() {
  deteccionActiva = false;
  clearInterval(deteccionIntervalo);
  context.clearRect(0, 0, canvas.width, canvas.height);
  video.pause();
  videoModule.pararVideo(); // Detiene la cámara

  // Ocultar la sección y reactivar el botón de inicio
  $("#tensorflowSection").hide();
  $("#mostrarTensorFlow").prop("disabled", false);
}

export { detectarObjetos, detenerReconocimiento };
