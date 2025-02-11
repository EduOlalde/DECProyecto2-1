# Aplicación Meteorológica - Tercer Proyecto para el módulo de Entorno Cliente del grado DAW

## Descripción

Esta aplicación web permite a los usuarios consultar información meteorológica en tiempo real y visualizar datos históricos a través de gráficos y tablas interactivas. La aplicación utiliza la API de Open-Meteo para obtener los datos climáticos y está desarrollada utilizando tecnologías modernas como JavaScript, jQuery, Firebase, Bootstrap, Leaflet y DataTables.

La aplicación también incluye autenticación de usuarios mediante Firebase, lo que permite a los usuarios registrarse, iniciar sesión y recuperar su contraseña.

El proyecto está desplegado en la siguiente dirección: https://decproyecto2-1-daw202-2025.web.app/

**Nota importante:** Este proyecto no incluye la configuración de Firebase. Deberás configurar tu propia cuenta de Firebase para que funcione correctamente.

## Características

*   **Autenticación de usuarios:** Los usuarios pueden registrarse, iniciar sesión y recuperar su contraseña a través de Firebase Authentication.
*   **Visualización de datos meteorológicos:** Consulta el clima en tiempo real utilizando la API Open-Meteo, que incluye información como temperatura, humedad, precipitaciones y velocidad del viento.
*   **Mapa interactivo:** Utiliza Leaflet.js para mostrar un mapa interactivo con puntos de interés geolocalizados.
*   **Historial climático:** Visualiza los datos meteorológicos históricos a través de una tabla interactiva usando DataTables.js.
*   **Gráficos interactivos:** Representa visualmente los datos climáticos mediante gráficos generados con Chart.js.
*   **Reconocimiento de objetos con TensorFlow.js:** Una funcionalidad de demo que utiliza TensorFlow.js para realizar el reconocimiento de objetos en tiempo real a través de la cámara del dispositivo.

## Tecnologías utilizadas

*   **HTML5, CSS3 y Bootstrap:** Para el diseño responsivo y la estructura de la interfaz de usuario.
*   **JavaScript y jQuery:** Para la manipulación del DOM y la interacción con el backend.
*   **Firebase Authentication:** Para gestionar el registro, inicio de sesión y recuperación de contraseñas de los usuarios.
*   **Open-Meteo API:** Para obtener los datos climáticos en tiempo real.
*   **Leaflet.js:** Para mostrar el mapa interactivo y realizar la geolocalización.
*   **Chart.js:** Para crear gráficos interactivos con los datos meteorológicos.
*   **DataTables.js:** Para la visualización de datos en formato tabular, con funcionalidades de filtrado, ordenación y exportación.
*   **TensorFlow.js:** Para realizar el reconocimiento de objetos en tiempo real utilizando la cámara del dispositivo.

## Uso de TensorFlow.js para el reconocimiento de objetos

La aplicación incluye una funcionalidad de demo que utiliza TensorFlow.js para el reconocimiento de objetos en tiempo real a través de la cámara del dispositivo. Los usuarios pueden iniciar el reconocimiento de objetos, seleccionando la cámara disponible y viendo las predicciones directamente en el video en vivo.

## Instalación y Configuración

1.  **Clonar el repositorio**

    Primero, clona el repositorio del proyecto desde GitHub:

    ```bash
    git clone [https://github.com/EduOlalde/DECProyecto2-1.git](https://github.com/EduOlalde/DECProyecto2-1.git)
    ```

2.  **Acceder al directorio del proyecto**

    Entra al directorio del proyecto clonado:

    ```bash
    cd aplicacion-meteorologica
    ```

3.  **Configurar Firebase**

    Este proyecto utiliza Firebase para la autenticación de usuarios. Para que la aplicación funcione correctamente, deberás configurar Firebase en tu cuenta.

    *   Crea un nuevo proyecto en Firebase Console.
    *   Configura el servicio de Firebase Authentication.
    *   Obtén las credenciales de tu proyecto y crea un archivo `config_firebase.js` en el directorio raíz de tu proyecto.

    El archivo `config_firebase.js` debería verse de la siguiente manera:

    ```javascript
    // config_firebase.js

    const firebaseConfig = {
      apiKey: "TU_API_KEY",
      authDomain: "TU_AUTH_DOMAIN",
      projectId: "TU_PROJECT_ID",
      storageBucket: "TU_STORAGE_BUCKET",
      messagingSenderId: "TU_MESSAGING_SENDER_ID",
      appId: "TU_APP_ID"
    };

    // Inicializa Firebase
    firebase.initializeApp(firebaseConfig);
    ```

    **Importante:** Asegúrate de reemplazar los valores de las variables con los datos de tu proyecto de Firebase.

4.  **Abrir el archivo index.html**

    Una vez que hayas configurado Firebase, abre el archivo `index.html` en un navegador para ejecutar la aplicación.


5.  **Desplegar en tu servidor**

    Si deseas desplegar la aplicación en un servidor web, simplemente sube todos los archivos del proyecto a tu servidor preferido. El proyecto está diseñado para ser estático, por lo que no requiere backend adicional.

## Uso

*   Registrarse o iniciar sesión en la aplicación.
*   Visualizar el clima en tiempo real en el mapa y en la tarjeta de información.
*   Agregar ubicaciones para obtener datos meteorológicos específicos.
*   Consultar el historial climático en la tabla y los gráficos.
*   Probar el reconocimiento de objetos en tiempo real utilizando TensorFlow.js.