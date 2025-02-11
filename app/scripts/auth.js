/**
 *  Inicialización del autenticador de Firebase. Necesita importar un JSON de configuración válido
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Importación del JSON de configuración
import { firebaseConfig } from "./config_firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para manejar el login
function login(email, password, callback) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            callback(null, user);
        })
        .catch((error) => callback(error, null));
}

function register(email, password, callback) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            callback(null, user);
        })
        .catch((error) => callback(error, null));
}

function logout(callback) {
    signOut(auth)
        .then(() => callback(null))
        .catch((error) => callback(error));
}

// Función para recuperar la contraseña
function recuperarContrasena(email, callback) {
    sendPasswordResetEmail(auth, email)
        .then(() => callback(null))
        .catch((error) => callback(error));
}

export { login, register, logout, recuperarContrasena };