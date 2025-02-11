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
async function iniciarVideo() {
  pararVideo();
  const constraints = {
    video: {
      facingMode: usarCamaraFrontal ? 'user' : { exact: 'environment' }
    }
  };
  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;
}

// Función para cambiar entre la cámara frontal y trasera
toggleCameraButton.addEventListener('click', () => {
  usarCamaraFrontal = !usarCamaraFrontal;
  iniciarVideo();
});

// Función para cargar el modelo y realizar la detección de objetos
export async function detectarObjetos() {
  modelo = await cocoSsd.load();
  iniciarVideo();
  video.addEventListener('loadeddata', () => {
    setInterval(async () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const predictions = await modelo.detect(video);
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

