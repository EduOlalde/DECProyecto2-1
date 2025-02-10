'use strict';

/**
* Obtiene la geolocalización del dispositivo.
* @returns {Promise<Object>} - Objeto con latitud y longitud o un error.
*/
function obtenerUbicacion() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject({ error: 'Error al obtener la ubicación.' });
                }
            );
        } else {
            reject({ error: 'El navegador no soporta la geolocalización.' });
        }
    });
}

/**
 * Obtiene el nombre de una ciudad en base a coordenadas usando la API nominatim de OSM
 */
async function obtenerCiudad(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la solicitud");

        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || "Ubicación desconocida";
    } catch (error) {
        console.error("Error obteniendo la ciudad:", error);
        return "Error al obtener la ciudad";
    }
}

/**
 * Obtiene la latitud y longitud de una ciudad usando la API de geocodificación de Open-Meteo.
 * @param {string} ciudad - Nombre de la ciudad ingresada por el usuario.
 * @returns {Promise<Object>} - Objeto con latitud, longitud, nombre y país o un error.
 */
async function obtenerCoordenadasCiudad(ciudad) {
    if (!ciudad.trim()) {
        return { error: 'Por favor, ingresa una ciudad.' };
    }

    try {
        // Llamada a la API para obtener la latitud y longitud de la ciudad
        const respuesta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es`);
        const datos = await respuesta.json();

        // Si no hay resultados, devolver un error
        if (!datos.results) {
            return { error: 'Ciudad no encontrada.' };
        }

        // Extraer datos de la primera coincidencia
        const { latitude, longitude, name, country } = datos.results[0];
        return { latitude, longitude, name, country };
    } catch (error) {
        console.error('Error obteniendo las coordenadas:', error);
        return { error: 'Error al obtener la ubicación.' };
    }
}

export { obtenerCiudad, obtenerUbicacion, obtenerCoordenadasCiudad };