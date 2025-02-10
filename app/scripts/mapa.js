'use strict';

import * as L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";
import { obtenerDatosClima } from "./meteo.js";
import { obtenerUbicacion } from "./localizacion.js";

let mapa;
let marcador;
let capasAdicionales = {}; // Para almacenar capas adicionales

export function inicializarMapa(){
    // Creación del mapa y añadido de la capa al mapa
    mapa = L.map('map');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mapa);
    obtenerUbicacion().then(ubicacion => {
        actualizarUbicacion(ubicacion.latitude, ubicacion.longitude);
    })
}

// Actualizar ubicación del usuario en el mapa
function actualizarUbicacion(lat, lon) {
    mapa.setView([lat, lon], 13); // Centrar en la ubicación

    if (marcador) {
        marcador.setLatLng([lat, lon]);
    } else {
        marcador = L.marker([lat, lon]).addTo(mapa)
            .bindPopup("Estás aquí").openPopup();
    }

    /*
    // Obtener datos ambientales para la ubicación
    obtenerDatosClima(lat, lon).then(datos => {
        agregarCapaInformacionAmbiental(datos, lat, lon);
    });
    */
}

// Agregar información ambiental al mapa
function agregarCapaInformacionAmbiental(datos, lat, lon) {
    const info = `
        <b>Temperatura:</b> ${datos.temperatura}°C<br>
        <b>Humedad:</b> ${datos.humedad}%<br>
        <b>Precipitaciones:</b> ${datos.precipitaciones} mm
    `;

    L.circleMarker([lat, lon], {
        color: 'blue',
        radius: 10
    }).addTo(mapa).bindPopup(info);
}

// Agregar capa adicional al mapa (ej: límites agrícolas)
function agregarCapaGeoJSON(url, nombreCapa) {
    fetch(url)
        .then(res => res.json())
        .then(geojsonData => {
            if (capasAdicionales[nombreCapa]) {
                mapa.removeLayer(capasAdicionales[nombreCapa]);
            }
            capasAdicionales[nombreCapa] = L.geoJSON(geojsonData, {
                style: { color: "green", weight: 2 }
            }).addTo(mapa);
        })
        .catch(err => console.error("Error cargando GeoJSON:", err));
}