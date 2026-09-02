// ======================================================
// CONFIGURACIÓN
// ======================================================

const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycby8wUcojpvdzRwuydG2NC1KQBF_WCZggVEDwImcjZyjjUMgWRQFIPKPbrFfg6DLe5cbKQ/exec";


// ======================================================
// ELEMENTOS
// ======================================================

const menuPrincipal =
    document.getElementById("menuPrincipal");

const formulario =
    document.getElementById("formulario");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const folio =
    document.getElementById("folio");

const nombre =
    document.getElementById("nombre");

const actividad =
    document.getElementById("actividad");

const campoNombre =
    document.getElementById("campoNombre");

const campoActividad =
    document.getElementById("campoActividad");

const mensaje =
    document.getElementById("mensaje");

const btnEntrada =
    document.getElementById("btnEntrada");

const btnSalida =
    document.getElementById("btnSalida");

const btnBuscar =
    document.getElementById("btnBuscar");

const btnRegistrar =
    document.getElementById("btnRegistrar");

const btnCancelar =
    document.getElementById("btnCancelar");


// ======================================================
// MODO ACTUAL
// ======================================================

let modoActual = "";


// ======================================================
// BOTÓN ENTRADA
// ======================================================

btnEntrada.addEventListener("click", function () {

    modoActual = "ENTRADA";

    abrirFormulario("ENTRADA");

});


// ======================================================
// BOTÓN SALIDA
// ======================================================

btnSalida.addEventListener("click", function () {

    modoActual = "SALIDA";

    abrirFormulario("SALIDA");

});


// ======================================================
// ABRIR FORMULARIO
// ======================================================

function abrirFormulario(modo) {

    menuPrincipal.classList.add("oculto");

    formulario.classList.remove("oculto");

    tituloFormulario.textContent =
        "Registro de " + modo;

    folio.value = "";

    nombre.value = "";

    actividad.value = "";

    campoNombre.classList.add("oculto");

    campoActividad.classList.add("oculto");

    mensaje.textContent = "";

    mensaje.className = "mensaje";

    btnRegistrar.disabled = true;

    folio.focus();

}


// ======================================================
// BUSCAR FOLIO
// ======================================================

btnBuscar.addEventListener(
    "click",
    buscarFolio
);


// ENTER EN EL CAMPO FOLIO

folio.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            buscarFolio();

        }

    }
);


// ======================================================
// FUNCIÓN BUSCAR
// ======================================================

async function buscarFolio() {

    const folioIngresado =
        folio.value.trim();


    if (!folioIngresado) {

        mostrarMensaje(
            "Ingresa un folio.",
            "error"
        );

        folio.focus();

        return;
    }


    mostrarMensaje(
        "Buscando folio...",
        "info"
    );


    btnBuscar.disabled = true;


    try {

        const url =
            URL_APPS_SCRIPT +
            "?accion=buscar&folio=" +
            encodeURIComponent(folioIngresado);


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            throw new Error(
                "Error HTTP " +
                respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta Google:",
            datos
        );


        if (datos.error) {

            throw new Error(
                datos.error
            );

        }


        // ==========================================
        // FOLIO ENCONTRADO
        // ==========================================

        if (datos.encontrado) {

            nombre.value =
                datos.nombre || "";


            campoNombre.classList.remove(
                "oculto"
            );


            // ENTRADA

            if (modoActual === "ENTRADA") {

                campoActividad.classList.remove(
                    "oculto"
                );

                btnRegistrar.disabled = false;

                mostrarMensaje(
                    "Folio encontrado. Escribe la actividad.",
                    "exito"
                );

                actividad.focus();

            }


            // SALIDA

            else if (modoActual === "SALIDA") {

                btnRegistrar.disabled = false;

                mostrarMensaje(
                    "Folio encontrado. Puedes registrar la salida.",
                    "exito"
                );

            }

        }


        // ==========================================
        // FOLIO NO ENCONTRADO
        // ==========================================

        else {

            campoNombre.classList.add(
                "oculto"
            );

            campoActividad.classList.add(
                "oculto"
            );

            btnRegistrar.disabled = true;


            if (modoActual === "ENTRADA") {

                mostrarMensaje(
                    "El folio no está registrado en BD_USUARIOS.",
                    "error"
                );

            }
            else {

                mostrarMensaje(
                    "El folio no está registrado en BD_USUARIOS.",
                    "error"
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Error al buscar:",
            error
        );

        mostrarMensaje(
            "No se pudo conectar con Google Sheets.",
            "error"
        );

    }

    finally {

        btnBuscar.disabled = false;

    }

}


// ======================================================
// REGISTRAR
// ======================================================

btnRegistrar.addEventListener(
    "click",
    registrar
);


// ======================================================
// FUNCIÓN REGISTRAR
// ======================================================

async function registrar() {

    const folioValor =
        folio.value.trim();

    const nombreValor =
        nombre.value.trim();

    const actividadValor =
        actividad.value.trim();


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!folioValor) {

        mostrarMensaje(
            "Ingresa el folio.",
            "error"
        );

        return;
    }


    if (!nombreValor) {

        mostrarMensaje(
            "No se encontró el nombre.",
            "error"
        );

        return;
    }


    if (
        modoActual === "ENTRADA" &&
        !actividadValor
    ) {

        mostrarMensaje(
            "Escribe la actividad.",
            "error"
        );

        actividad.focus();

        return;
    }


    // ==========================================
    // DATOS
    // ==========================================

    const datos = {

        modo: modoActual,

        folio: folioValor,

        nombre: nombreValor,

        actividad:
            actividadValor || "-"

    };


    console.log(
        "Datos enviados:",
        datos
    );


    mostrarMensaje(
        "Registrando...",
        "info"
    );


    btnRegistrar.disabled = true;

    btnBuscar.disabled = true;


    try {

        /*
         * Tu Apps Script utiliza:
         *
         * JSON.parse(e.postData.contents)
         *
         * Por eso enviamos JSON.
         */

        await fetch(
            URL_APPS_SCRIPT,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(datos)
            }
        );


        /*
         * Google Apps Script recibe el POST.
         *
         * Debido a no-cors, el navegador
         * no permite leer la respuesta.
         */


        mostrarMensaje(
            modoActual === "ENTRADA"
                ? "ENTRADA registrada correctamente."
                : "SALIDA registrada correctamente.",
            "exito"
        );


        // Volver al inicio

        setTimeout(
            volverInicio,
            1800
        );

    }

    catch (error) {

        console.error(
            "Error al registrar:",
            error
        );

        mostrarMensaje(
            "Ocurrió un error al registrar.",
            "error"
        );

        btnRegistrar.disabled = false;

        btnBuscar.disabled = false;

    }

}


// ======================================================
// CANCELAR
// ======================================================

btnCancelar.addEventListener(
    "click",
    volverInicio
);


// ======================================================
// VOLVER AL INICIO
// ======================================================

function volverInicio() {

    formulario.classList.add(
        "oculto"
    );

    menuPrincipal.classList.remove(
        "oculto"
    );

    folio.value = "";

    nombre.value = "";

    actividad.value = "";

    campoNombre.classList.add(
        "oculto"
    );

    campoActividad.classList.add(
        "oculto"
    );

    mensaje.textContent = "";

    mensaje.className = "mensaje";

    btnRegistrar.disabled = true;

    btnBuscar.disabled = false;

    modoActual = "";

}


// ======================================================
// MOSTRAR MENSAJE
// ======================================================

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent = texto;

    mensaje.className =
        "mensaje " + tipo;

}
