'use strict';

import { obtenerCiudad, obtenerUbicacion } from "./localizacion.js";

/**
 * Obtiene los datos del clima en base a latitud y longitud con la API Open-Meteo
 * Devuelve un JSON con una selección de datos filtrada a partir de la respuesta
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Object>} - Objeto con datos del clima o un error.
 */
async function obtenerDatosMeteorologicos(latitud, longitud) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,apparent_temperature,visibility,pressure_msl,uv_index,precipitation,cloudcover&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        return {
            latitud: latitud,
            longitud: longitud,
            temperaturaActual: datos.hourly.temperature_2m[0],
            humedad: datos.hourly.relativehumidity_2m[0],
            viento: datos.hourly.windspeed_10m[0],
            precipitacion: datos.hourly.precipitation[0],
            temperaturaMaxima: datos.daily.temperature_2m_max[0],
            temperaturaMinima: datos.daily.temperature_2m_min[0],
        };

    } catch (error) {
        console.error("Error al obtener los datos meteorológicos:", error);
        return null;
    }
}

/**
 * Obtiene los datos de clima de la ubicación actual y los muestra en el navegador
 */
async function obtenerDatosClima() {
    try {
        const ubicacion = await obtenerUbicacion();
        const datos = await obtenerDatosMeteorologicos(ubicacion.latitude, ubicacion.longitude);
        const ciudad = await obtenerCiudad(ubicacion.latitude, ubicacion.longitude);

        if (datos) {
            $("#tituloClima").text(`El clima en ${ciudad}`);
            $("#temp").text(`Temperatura: ${datos.temperaturaActual} °C`);
            $("#temp-max").text(`Temperatura máxima: ${datos.temperaturaMaxima} °C`);
            $("#temp-min").text(`Temperatura mínima: ${datos.temperaturaMinima} °C`);
            $("#humidity").text(`Humedad: ${datos.humedad} %`);
            $("#precipitation").text(`Precipitaciones: ${datos.precipitacion} mm`);
            $("#wind").text(`Velocidad del viento: ${datos.viento} km/h`);
        } else {
            console.error("No se pudieron actualizar los datos meteorológicos.");
        }
    } catch (error) {
        console.error(error.error);
    }
}

'use strict';

/**
 * Obtiene datos históricos del clima para múltiples ubicaciones en un año específico.
 * @param {Array} ubicaciones - Array de objetos con latitud, longitud y nombre de la ubicación.
 * @param {number} anno - Año para obtener datos históricos.
 * @returns {Promise<Array>} - Array de datos meteorológicos históricos organizados por ubicación y fecha.
 */
async function obtenerHistorialClima(ubicaciones, anno) {
    const fechaInicio = `${anno}-01-01`;
    const fechaFin = `${anno}-12-31`;

    let datosCompletos = [];

    for (const ubicacion of ubicaciones) {
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${ubicacion.latitud}&longitude=${ubicacion.longitud}&start_date=${fechaInicio}&end_date=${fechaFin}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            if (!datos.daily || !datos.daily.time) {
                console.error(`No hay datos disponibles para ${ubicacion.nombre} en el año ${anno}`);
                continue;
            }

            const datosUbicacion = datos.daily.time.map((fecha, index) => ({
                ciudad: ubicacion.nombre,
                anno,
                fecha,
                temperaturaMax: datos.daily.temperature_2m_max[index],
                temperaturaMin: datos.daily.temperature_2m_min[index],
                precipitacion: datos.daily.precipitation_sum[index],
                viento: datos.daily.windspeed_10m_max[index],
            }));

            datosCompletos = datosCompletos.concat(datosUbicacion);
        } catch (error) {
            console.error(`Error obteniendo datos de ${ubicacion.nombre} para el año ${anno}:`, error);
        }
    }

    return datosCompletos;
}

export { obtenerDatosClima, obtenerHistorialClima, obtenerDatosMeteorologicos };

