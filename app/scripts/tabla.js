'use strict';

/**
 * Crea una tabla mediante la API DataTables
 * @param {*} datos - Datos meteorológicos históricos
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
        dom: 'frtipB',
        buttons: [
            { extend: 'copyHtml5', text: '📋 Copiar', className: 'btn btn-sm btn-outline-primary' },
            { extend: 'csvHtml5', text: '📄 CSV', className: 'btn btn-sm btn-outline-success' },
            { extend: 'excelHtml5', text: '📊 Excel', className: 'btn btn-sm btn-outline-warning' },
            { extend: 'pdfHtml5', text: '📕 PDF', className: 'btn btn-sm btn-outline-danger' },
            { extend: 'print', text: '🖨️ Imprimir', className: 'btn btn-sm btn-outline-secondary' }
        ],
        language: {
            url: "./recursos/datatables-es-ES.json"
        }
    });
}

export { cargarDatosEnTabla };
