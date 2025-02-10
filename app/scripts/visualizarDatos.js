'use strict';

import { obtenerHistorialClima } from "./meteo.js";
import { obtenerUbicacion, obtenerCoordenadasCiudad, obtenerCiudad } from "./localizacion.js";

let ubicaciones = []; // Lista de ubicaciones ingresadas con año
let graficoClima; // Variable para almacenar datos de los gráficos

/**
 * Agrega una nueva ubicación con su año seleccionado y actualiza la tabla y el gráfico.
 * @param {Object} ubicacion - Objeto con latitud, longitud, nombre de la ciudad y año.
 */
async function agregarUbicacion(ubicacion, anno) {
    // Verifica si la ciudad con el mismo año ya está en la lista
    if (ubicaciones.some(u => u.nombre === ubicacion.nombre && u.anno === anno)) {
        alert("Esta ciudad ya ha sido añadida para este año.");
        return;
    }

    // Agregar la ubicación con el año
    ubicaciones.push({ ...ubicacion, anno });

    // Obtener datos meteorológicos
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
            { data: "anno", title: "Año" },
            { data: "fecha", title: "Fecha" },
            { data: "temperaturaMax", title: "Temp. Máx (°C)" },
            { data: "temperaturaMin", title: "Temp. Mín (°C)" },
            { data: "precipitacion", title: "Precipitación (mm)" },
            { data: "viento", title: "Viento (km/h)" }
        ],
        responsive: true,
        dom: 'frtipB', // Mueve los botones debajo de la tabla
        buttons: [
            {
                extend: 'copyHtml5',
                text: '📋 Copiar',
                className: 'btn btn-sm btn-outline-primary'
            },
            {
                extend: 'csvHtml5',
                text: '📄 CSV',
                className: 'btn btn-sm btn-outline-success'
            },
            {
                extend: 'excelHtml5',
                text: '📊 Excel',
                className: 'btn btn-sm btn-outline-warning'
            },
            {
                extend: 'pdfHtml5',
                text: '📕 PDF',
                className: 'btn btn-sm btn-outline-danger'
            },
            {
                extend: 'print',
                text: '🖨️ Imprimir',
                className: 'btn btn-sm btn-outline-secondary'
            }
        ],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
        }
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

    // Obtener combinaciones únicas de ciudad y año
    const ciudadesAnios = [...new Set(datos.map(d => `${d.ciudad} (${d.anno})`))];
    const etiquetas = [...new Set(datos.map(d => d.fecha))];

    const datasets = [];
    const colores = {};

    ciudadesAnios.forEach(ciudadAnno => {
        if (!colores[ciudadAnno]) {
            colores[ciudadAnno] = getRandomColor();
        }

        datasets.push(
            {
                label: `Temp. Máx ${ciudadAnno} (°C)`,
                data: datos.filter(d => `${d.ciudad} (${d.anno})` === ciudadAnno).map(d => d.temperaturaMax),
                borderColor: colores[ciudadAnno],
                backgroundColor: colores[ciudadAnno],
                fill: false
            },
            {
                label: `Precipitación ${ciudadAnno} (mm)`,
                data: datos.filter(d => `${d.ciudad} (${d.anno})` === ciudadAnno).map(d => d.precipitacion),
                borderColor: colores[ciudadAnno],
                backgroundColor: colores[ciudadAnno],
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

/**
 * Genera un color aleatorio en formato HSL.
 */
function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

/**
 * Eventos para capturar la ciudad y el año seleccionados.
 */
export function agregarEventosDatos() {
    $("#agregar-ubicacion-btn").on("click", async () => {
        const ciudad = $("#ciudad-input").val().trim();
        const anno = parseInt($("#anno-select").val(), 10); // Obtener el año seleccionado

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

            await agregarUbicacion({ nombre: ciudad, latitud: coords.latitude, longitud: coords.longitude }, anno);
        } catch (error) {
            alert("No se pudo obtener la ubicación.");
        }
    });
}
