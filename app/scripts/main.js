'use strict';

// Importación de las distintas funciones necesarias
import { obtenerDatosClima } from "./meteo.js";

import { inicializarMapa } from "./mapa.js";

import { agregarEventosDatos, rellenarSelectAnno } from "./visualizarDatos.js";

// Firebase
import { login, register, logout, recuperarContrasena } from "./auth.js";

// TensorFlow
import { detectarObjetos, detenerReconocimiento } from "./tensorflow.js";
import { comprobarCamaras, iniciarVideo } from "./video.js";


$(document).ready(inicio);

function inicio() {
    addEventos();
}

/**
 * Mostrar el contenido principal e inicializar funcionalidad
 */
function loggedIn() {
    $('#seccion-auth').hide();
    $('#logout-btn').show();
    $('#bloquePrincipal').show();

    obtenerDatosClima();
    inicializarMapa();
    agregarEventosDatos();
    rellenarSelectAnno();
}

/**
 * Función para mostrar mensajes
 * @param {*} mensaje - Cadena del mensaje
 * @param {*} tipo - Estilo del mensaje
 */
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = $('#mensaje');
    mensajeDiv.removeClass().addClass(`alert alert-${tipo}`).text(mensaje).show();
}

/**
 * Aplicación de eventos al DOM
 */
function addEventos() {
    // Login
    $('#login-btn').click(function () {
        const email = $('#email').val();
        const password = $('#password').val();

        if (!email || !password) {
            mostrarMensaje("Por favor ingresa un correo y una contraseña.", "danger");
            return;
        }

        login(email, password, (error, user) => {
            if (error) {
                mostrarMensaje("Error: " + error.message, "danger");
            } else {
                mostrarMensaje("¡Bienvenido, " + user.email + "!", "success");
                loggedIn();
            }
        });
    });

    // Registro
    $('#registro-btn').click(function () {
        const email = $('#email').val();
        const password = $('#password').val();

        if (!email || !password) {
            mostrarMensaje("Por favor ingresa un correo y una contraseña.", "danger");
            return;
        }

        register(email, password, (error, user) => {
            if (error) {
                mostrarMensaje("Error: " + error.message, "danger");
            } else {
                mostrarMensaje("¡Cuenta creada, " + user.email + "!", "success");
                $('#seccion-auth').hide();
                setTimeout(() => { location.reload(); }, 2000);
            }
        });
    });

    // Logout
    $('#logout-btn').click(function () {
        logout((error) => {
            if (error) {
                mostrarMensaje("Error al cerrar sesión: " + error.message, "danger");
            } else {
                mostrarMensaje("Has cerrado sesión exitosamente.", "success");
                $('#bloquePrincipal').hide();
                $('#logout-btn').hide();
                setTimeout(() => { location.reload(); }, 2000);
            }
        });
    });

    // Recuperación de contraseña
    $('#recuperacion-btn').click(function () {
        const email = $('#email').val();

        if (!email) {
            mostrarMensaje("Por favor ingresa tu correo para recuperar la contraseña.", "danger");
            return;
        }

        recuperarContrasena(email, (error) => {
            if (error) {
                mostrarMensaje("Error: " + error.message, "danger");
            } else {
                mostrarMensaje("Te hemos enviado un correo para recuperar tu contraseña.", "info");
            }
        });
    });


    // TensorFlow
    $("#mostrarTensorFlow").on("click", async function () {
        const camerasAvailable = await comprobarCamaras();

        if (!camerasAvailable) {
            alert("No se encontraron cámaras disponibles.");
            return;
        }

        $("#tensorflowSection").show();
        const selectedCamera = $("#cameraSelect").val(); // Obtener la cámara seleccionada
        detectarObjetos(selectedCamera);
        $(this).prop("disabled", true);
    });

    // Evento para cambiar la cámara cuando el usuario selecciona otra
    $("#cameraSelect").on("change", function () {
        iniciarVideo($(this).val());
    });


    $("#detenerReconocimiento").on("click", function () {
        detenerReconocimiento();
    })

}