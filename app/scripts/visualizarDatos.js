'use strict';

import { obtenerUbicacion, obtenerCoordenadasCiudad, obtenerCiudad } from "./localizacion.js";
import { agregarUbicacion } from "./ubicaciones.js";

/**
 * Rellena el selector de años desde 1950 hasta la actualidad.
 */
function rellenarSelectAnno() {
    let annoSelect = $("#anno-select");

    for (let anno = 1950; anno <= new Date().getFullYear(); anno++) {
        $("<option>")
            .val(anno)
            .text(anno)
            .appendTo(annoSelect);
    }
}

/**
 * Captura eventos para obtener ciudad y año seleccionados.
 */
function agregarEventosDatos() {
    $("#agregar-ubicacion-btn").on("click", async () => {
        const ciudad = $("#ciudad-input").val().trim();
        const anno = parseInt($("#anno-select").val(), 10);

        if (isNaN(anno)) {
            alert("Por favor, selecciona un año.");
            return;
        }

        if (!ciudad) {
            alert("Por favor, ingresa una ciudad.");
            return;
        }

        const ubicacion = await obtenerCoordenadasCiudad(ciudad);
        if (ubicacion.error) {
            alert(ubicacion.error);
        } else {
            await agregarUbicacion(
                { nombre: `${ubicacion.name}, ${ubicacion.country}`, latitud: ubicacion.latitude, longitud: ubicacion.longitude },
                anno
            );
        }

        $("#ciudad-input").val("");
    });

    $("#ubicacion-actual-btn").on("click", async () => {
        try {
            const coords = await obtenerUbicacion();
            const ciudad = await obtenerCiudad(coords.latitude, coords.longitude);
            const anno = parseInt($("#anno-select").val(), 10);

            if (isNaN(anno)) {
                alert("Por favor, selecciona un año.");
                return;
            }

            await agregarUbicacion({ nombre: ciudad, latitud: coords.latitude, longitud: coords.longitude }, anno);
        } catch (error) {
            alert("No se pudo obtener la ubicación.");
        }
    });
}

export { agregarEventosDatos, rellenarSelectAnno };
