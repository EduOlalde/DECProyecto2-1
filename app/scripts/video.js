'use strict';

const video = $("#video")[0];
const cameraSelect = $("#cameraSelect");

let currentStream = null;

/**
 * Detiene la cámara actual
 */
function pararVideo() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

/**
 * Inicia la cámara seleccionada
 * @param {*} deviceId - ID de la cámara
 * @returns 
 */
async function iniciarVideo(deviceId = null) {
    pararVideo(); // Asegura que no haya otra cámara activa

    if (!deviceId) {
        console.error("No se ha seleccionado un dispositivo de cámara válido.");
        return;
    }

    const constraints = { video: { deviceId: { exact: deviceId } } };

    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;

        $(video).on("loadedmetadata", function () {
            video.play().catch(error => console.error("Error al reproducir el video:", error));
        });

        $(video).hide(); // Ocultar el video (solo lo usamos como fuente)
    } catch (error) {
        console.error("Error al iniciar la cámara:", error);
        alert("No se pudo acceder a la cámara.");
    }
}

/**
 * Comprueba las cámaras disponibles
 * @returns true si hay cámaras disponibles
 */
async function comprobarCamaras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === "videoinput");

        if (videoInputs.length === 0) return false;

        cameraSelect.empty(); // Limpiar opciones

        videoInputs.forEach((device, index) => {
            $("<option>")
                .val(device.deviceId)
                .text(device.label || `Cámara ${index + 1}`)
                .appendTo(cameraSelect);
        });

        // Seleccionar automáticamente la primera cámara disponible
        if (videoInputs.length > 0) {
            cameraSelect.val(videoInputs[0].deviceId);
            iniciarVideo(cameraSelect.val());
        }

        return true;
    } catch (error) {
        console.error("Error al comprobar cámaras:", error);
        return false;
    }
}

export { iniciarVideo, comprobarCamaras, pararVideo };
