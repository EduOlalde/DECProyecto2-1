'use strict';

const video = $("#video")[0];
const cameraSelect = $("#cameraSelect");

let currentStream = null;

// Detener la cámara actual
function pararVideo() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

// Iniciar la cámara con el dispositivo seleccionado
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

// Comprobar cámaras disponibles
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

// Exportar funciones
export { iniciarVideo, comprobarCamaras, pararVideo };
