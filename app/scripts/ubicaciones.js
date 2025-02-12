'use strict';

import { obtenerHistorialClima } from "./meteo.js";
import { cargarDatosEnTabla } from "./tabla.js";
import { cargarGrafico } from "./grafico.js";

let ubicaciones = [];

/**
 * Agrega una nueva ubicación con su año seleccionado y actualiza la tabla y el gráfico.
 * @param {Object} ubicacion - Objeto con latitud, longitud, nombre de la ciudad y año.
 * @param {number} anno - Año seleccionado por el usuario.
 */
async function agregarUbicacion(ubicacion, anno) {
    if (ubicaciones.some(u => u.nombre === ubicacion.nombre && u.anno === anno)) {
        alert("Esta ciudad ya ha sido añadida para este año.");
        return;
    }

    ubicaciones.push({ ...ubicacion, anno });

    const datos = await obtenerHistorialClima(ubicaciones, anno);
    if (datos.length > 0) {
        cargarDatosEnTabla(datos);
        cargarGrafico(datos);
    }
}

export { agregarUbicacion, ubicaciones };
