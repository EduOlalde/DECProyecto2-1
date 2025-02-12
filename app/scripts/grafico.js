'use strict';

let graficoClima;

/**
 * Carga los datos en un gráfico de líneas con Chart.js.
 * @param {Array} datos - Datos meteorológicos históricos.
 */
function cargarGrafico(datos) {
    const ctx = document.getElementById("grafico-clima").getContext("2d");

    if (graficoClima) {
        graficoClima.destroy();
    }

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
        data: { labels: etiquetas, datasets: datasets },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

/**
 * Genera un color aleatorio en formato HSL.
 */
function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

export { cargarGrafico };
