'use strict';

import { obtenerHistorialClima } from "./meteo.js";
import { obtenerUbicacion, obtenerCoordenadasCiudad, obtenerCiudad } from "./localizacion.js";

let ubicaciones = []; // Lista de ubicaciones ingresadas
let graficoClima; // Variable para almacenar datos de los gráficos

/**
 * Agrega una nueva ubicación a la lista y actualiza la tabla y el gráfico.
 * @param {Object} ubicacion - Objeto con latitud, longitud y nombre de la ciudad.
 */
async function agregarUbicacion(ubicacion, anno) {
    // Verifica que la ciudad no esté ya en la lista
    if (ubicaciones.some(u => u.nombre === ubicacion.nombre)) {
        alert("Esta ciudad ya ha sido añadida.");
        return;
    }

    ubicaciones.push(ubicacion); // Agregar la ubicación a la lista

    // Obtener datos meteorológicos actualizados
    const datos = await obtenerHistorialClima(ubicaciones, anno);

    if (datos.length > 0) {
        cargarDatosEnTabla(datos);
        cargarGrafico(datos);
    }
}

/**
 * Carga los datos meteorológicos en la tabla con DataTables.js.
 * @param {Array} datos - Datos meteorológicos históricos.
 */
function cargarDatosEnTabla(datos) {
    $("#tabla-clima").DataTable({
        destroy: true,
        data: datos,
        columns: [
            { data: "ciudad", title: "Ciudad" },
            { data: "fecha", title: "Fecha" },
            { data: "temperaturaMax", title: "Temp. Máx (°C)" },
            { data: "temperaturaMin", title: "Temp. Mín (°C)" },
            { data: "precipitacion", title: "Precipitación (mm)" },
            { data: "viento", title: "Viento (km/h)" }
        ],
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    });
}

/**
 * Carga los datos meteorológicos en un gráfico de líneas con Chart.js.
 * @param {Array} datos - Datos meteorológicos históricos.
 */
function cargarGrafico(datos) {
    const ctx = document.getElementById("grafico-clima").getContext("2d");

    if (graficoClima) {
        graficoClima.destroy();
    }

    const ciudades = [...new Set(datos.map(d => d.ciudad))];
    const etiquetas = [...new Set(datos.map(d => d.fecha))];

    const datasets = [];
    const colores = {};

    ciudades.forEach(ciudad => {
        if (!colores[ciudad]) {
            colores[ciudad] = getRandomColor();
        }

        datasets.push(
            {
                label: `Temp. Máx ${ciudad} (°C)`,
                data: datos.filter(d => d.ciudad === ciudad).map(d => d.temperaturaMax),
                borderColor: colores[ciudad],
                backgroundColor: colores[ciudad],
                fill: false
            },
            {
                label: `Precipitación ${ciudad} (mm)`,
                data: datos.filter(d => d.ciudad === ciudad).map(d => d.precipitacion),
                borderColor: colores[ciudad],
                backgroundColor: colores[ciudad],
                borderDash: [5, 5],
                fill: false
            }
        );
    });

    graficoClima = new Chart(ctx, {
        type: "line",
        data: {
            labels: etiquetas,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

export function agregarEventosDatos() {
    $("#agregar-ubicacion-btn").on("click", async () => {
        const ciudad = $("#ciudad-input").val().trim();
        const anno = parseInt($("#anno-select").val(), 10);

        if (!ciudad) {
            alert("Por favor, ingresa una ciudad.");
            return;
        }

        const ubicacion = await obtenerCoordenadasCiudad(ciudad);
        if (ubicacion.error) {
            alert(ubicacion.error);
        } else {
            await agregarUbicacion({ nombre: `${ubicacion.name}, ${ubicacion.country}`, latitud: ubicacion.latitude, longitud: ubicacion.longitude }, anno);
        }

        $("#ciudad-input").val("");
    });

    $("#ubicacion-actual-btn").on("click", async () => {
        try {
            const coords = await obtenerUbicacion();
            const ciudad = await obtenerCiudad(coords.latitude, coords.longitude);
            const anno = parseInt($("#anno-select").val(), 10);

            await agregarUbicacion({ nombre: ciudad, latitud: coords.latitude, longitud: coords.longitude }, anno);
        } catch (error) {
            alert("No se pudo obtener la ubicación.");
        }
    });
}
