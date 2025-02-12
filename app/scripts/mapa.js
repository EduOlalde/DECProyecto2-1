'use strict';

import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";
import { obtenerUbicacion } from "./localizacion.js";
import { obtenerDatosMeteorologicos } from "./meteo.js";

let mapa;
let marcador;

export function inicializarMapa() {
    // Inicializa el mapa
    mapa = L.map('map');
    // Añade la capa de mapa base
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mapa);

    // Obtiene la ubicación del usuario
    obtenerUbicacion().then(ubicacion => {
        actualizarUbicacion(ubicacion.latitude, ubicacion.longitude);
    });
}

function actualizarUbicacion(lat, lon) {
    // Actualiza la vista del mapa con la nueva ubicación
    const latLng = [lat, lon];
    mapa.setView(latLng, 13);

    // Si el marcador ya existe, actualiza su posición; si no, crea uno nuevo
    if (marcador) {
        marcador.setLatLng(latLng);
    } else {
        marcador = L.marker(latLng).addTo(mapa)
            .bindPopup("Estás aquí");
    }

    // Obtiene los datos meteorológicos y los muestra en el mapa
    obtenerDatosMeteorologicos(lat, lon).then(datos => {
        agregarCapaInformacionAmbiental(datos, lat, lon);
    });
}

function agregarCapaInformacionAmbiental(datos, lat, lon) {
    // Muestra la información ambiental del lugar (temperatura, humedad, etc.)
    const info = `
        <b>Temperatura:</b> ${datos.temperaturaActual}°C<br>
        <b>Humedad:</b> ${datos.humedad}%<br>
        <b>Precipitaciones:</b> ${datos.precipitacion} mm<br>
        <b>Viento:</b> ${datos.viento} km/h
    `;

    // Añade un marcador con la información ambiental en la ubicación
    L.circleMarker([lat, lon], {
        color: 'blue',
        radius: 10
    }).addTo(mapa).bindPopup(info).openPopup();
}
