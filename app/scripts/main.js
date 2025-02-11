'use strict';

// Importación de las distintas funciones necesarias
import { obtenerDatosClima } from "./meteo.js";

import { inicializarMapa } from "./mapa.js";

import { agregarEventosDatos } from "./visualizarDatos.js";

// Firebase
import { firebaseConfig } from "./config_firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// TensorFlow
import { detectarObjetos } from "./tensorflow.js";


$(document).ready(inicio);
// Iniciar firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function inicio() {

    addEventos();
}


function loggedIn() {
    $('#seccion-auth').hide();
    $('#logout-btn').show();
    $('#bloquePrincipal').show();

    obtenerDatosClima();
    inicializarMapa();
    agregarEventosDatos();
    rellenarSelectAnno();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = $('#mensaje');
    mensajeDiv.removeClass().addClass(`alert alert-${tipo}`).text(mensaje).show();
}

function rellenarSelectAnno() {
    let annoSelect = $("#anno-select")[0];
    for (let anno = 1950; anno <= new Date().getFullYear(); anno++) {
        let opcion = document.createElement("option");
        opcion.value = anno;
        opcion.textContent = anno;
        annoSelect.appendChild(opcion);
    }
}


// Función para comprobar si hay cámaras disponibles
async function checkCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === "videoinput");
        return videoInputs.length > 0; // Retorna true si hay cámaras disponibles
    } catch (error) {
        console.error("Error al comprobar las cámaras:", error);
        return false;
    }
}

function addEventos() {
    // Iniciar sesión
    $('#login-btn').click(function () {
        const email = $('#email').val();
        const password = $('#password').val();

        if (email === "" || password === "") {
            mostrarMensaje("Por favor ingresa un correo y una contraseña.", "danger");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                mostrarMensaje("¡Bienvenido, " + user.email + "!", "success");
                loggedIn();

            })
            .catch((error) => {
                const errorMessage = error.message;
                mostrarMensaje("Error: " + errorMessage, "danger");
            });
    });

    // Registrarse
    $('#registro-btn').click(function () {
        const email = $('#email').val();
        const password = $('#password').val();

        if (email === "" || password === "") {
            mostrarMensaje("Por favor ingresa un correo y una contraseña.", "danger");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                mostrarMensaje("¡Cuenta creada, " + user.email + "!", "success");
                $('#seccion-auth').hide();
                setTimeout(() => { location.reload() }, 2000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                mostrarMensaje("Error: " + errorMessage, "danger");
            });
    });

    // Cerrar sesión
    $('#logout-btn').click(function () {
        signOut(auth)
            .then(() => {
                mostrarMensaje("Has cerrado sesión exitosamente.", "success");
                $('#bloquePrincipal').hide();
                $('#logout-btn').hide();
                setTimeout(() => { location.reload() }, 2000);
            })
            .catch((error) => {
                const errorMessage = error.message;
                mostrarMensaje("Error al cerrar sesión: " + errorMessage, "danger");
            });
    });

    // Recuperar contraseña
    $('#recuperacion-btn').click(function () {
        const email = $('#email').val();

        if (email === "") {
            mostrarMensaje("Por favor ingresa tu correo para recuperar la contraseña.", "danger");
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                mostrarMensaje("Te hemos enviado un correo para recuperar tu contraseña.", "info");
            })
            .catch((error) => {
                const errorMessage = error.message;
                mostrarMensaje("Error: " + errorMessage, "danger");
            });
    });


    // Iniciar sección TensorFlow
    $("#mostrarTensorFlow").on("click", async function () {
        const camerasAvailable = await checkCameras();

        if (!camerasAvailable) {
            alert("No se encontraron cámaras disponibles. Verifica los permisos y la conexión del dispositivo.");
            return;
        }

        $("#tensorflowSection").show(); // Muestra la sección de TensorFlow
        detectObjects(); // Inicia el reconocimiento de objetos
        $(this).prop("disabled", true); // Deshabilita el botón
    });
}