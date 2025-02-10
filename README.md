# README - Aplicación Meteorológica - Tercer Proyecto para el módulo de Entorno Cliente del grado DAW

## Descripción
Esta aplicación web permite a los usuarios consultar información meteorológica en tiempo real y visualizar datos históricos a través de gráficos y tablas interactivas. Utiliza la API de Open-Meteo para obtener los datos climáticos y está desarrollada con JavaScript, jQuery, Firebase, Bootstrap, Leaflet y DataTables.

## Características
- **Autenticación de usuarios** con Firebase (registro, inicio de sesión y recuperación de contraseña).
- **Visualización de datos meteorológicos** en tiempo real mediante la API Open-Meteo.
- **Mapa interactivo** con Leaflet para ubicar puntos de interés.
- **Historial climático** en formato tabular con DataTables.
- **Gráficos** generados con Chart.js.

## Tecnologías utilizadas
- **HTML5, CSS3 y Bootstrap** para el diseño responsivo.
- **JavaScript y jQuery** para la manipulación del DOM.
- **Firebase Authentication** para la autenticación de usuarios.
- **Open-Meteo API** para la obtención de datos meteorológicos.
- **Leaflet.js** para la geolocalización y visualización de mapas.
- **Chart.js** para la representación de datos climáticos en gráficos.
- **DataTables.js** para la visualización de datos en formato tabular.

## Instalación y Configuración
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/tuusuario/aplicacion-meteorologica.git
   ```
2. Acceder al directorio del proyecto:
   ```sh
   cd aplicacion-meteorologica
   ```
3. Configurar Firebase en `config_firebase.js` con las credenciales del proyecto.
4. Abrir el archivo `index.html` en un navegador.

## Uso
1. Registrarse o iniciar sesión en la aplicación.
2. Visualizar el clima en tiempo real en el mapa y en la tarjeta de información.
3. Agregar ubicaciones para obtener datos meteorológicos específicos.
4. Consultar el historial climático en la tabla y los gráficos.