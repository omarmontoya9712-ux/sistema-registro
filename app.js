// =====================================================
// CONFIGURACIÓN
// =====================================================

const URL_SCRIPT =
    "https://script.google.com/macros/s/AKfycbxMUREOWwMkhq-0fxnS5lsP5XDHoz3xZLkHVxgzrpVGmx258nyc4eZBzOok0EWLTWPSOQ/exec";


// =====================================================
// ELEMENTOS DE LA PÁGINA
// =====================================================

const btnEntrada =
    document.getElementById("btnEntrada");

const btnSalida =
    document.getElementById("btnSalida");

const menuPrincipal =
    document.getElementById("menuPrincipal");

const formulario =
    document.getElementById("formulario");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const folioInput =
    document.getElementById("folio");

const nombreInput =
    document.getElementById("nombre");

const actividadInput =
    document.getElementById("actividad");

const campoNombre =
    document.getElementById("campoNombre");

const campoActividad =
    document.getElementById("campoActividad");

const mensaje =
    document.getElementById("mensaje");

const btnRegistrar =
    document.getElementById("btnRegistrar");

const btnCancelar =
    document.getElementById("btnCancelar");


// =====================================================
// VARIABLE DE CONTROL
// =====================================================

let modoActual = "";


// =====================================================
// ENTRADA
// =====================================================

btnEntrada.addEventListener("click", function () {

    modoActual = "ENTRADA";

    menuPrincipal.classList.add("oculto");

    formulario.classList.remove("oculto");

    tituloFormulario.textContent =
        "Registrar Entrada";

    campoNombre.classList.remove("oculto");

    campoActividad.classList.remove("oculto");

    folioInput.value = "";

    nombreInput.value = "";

    actividadInput.value = "";

    nombreInput.setAttribute("readonly", true);

    mostrarMensaje("", "");

    folioInput.focus();

});


// =====================================================
// SALIDA
// =====================================================

btnSalida.addEventListener("click", function () {

    modoActual = "SALIDA";

    menuPrincipal.classList.add("oculto");

    formulario.classList.remove("oculto");

    tituloFormulario.textContent =
        "Registrar Salida";

    campoNombre.classList.add("oculto");

    campoActividad.classList.add("oculto");

    folioInput.value = "";

    nombreInput.value = "";

    actividadInput.value = "";

    mostrarMensaje("", "");

    folioInput.focus();

});


// =====================================================
// BUSCAR FOLIO AL PRESIONAR ENTER
// =====================================================

folioInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            buscarFolio();

        }

    }
);


// =====================================================
// BUSCAR FOLIO AL SALIR DEL CAMPO
// =====================================================

folioInput.addEventListener(
    "blur",
    function () {

        buscarFolio();

    }
);


// =====================================================
// FUNCIÓN BUSCAR FOLIO
// =====================================================

async function buscarFolio() {

    const folio =
        folioInput.value.trim();


    if (folio === "") {

        return;

    }


    // ---------------------------------------------
    // SALIDA
    // ---------------------------------------------

    if (modoActual === "SALIDA") {

        mostrarMensaje(
            "Folio listo para registrar salida.",
            "info"
        );

        return;

    }


    // ---------------------------------------------
    // ENTRADA
    // ---------------------------------------------

    mostrarMensaje(
        "Buscando folio...",
        "info"
    );


    nombreInput.value = "";


    try {

        const url =
            URL_SCRIPT +
            "?accion=buscar&folio=" +
            encodeURIComponent(folio);


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo conectar con Google Sheets."
            );

        }


        const resultado =
            await respuesta.json();


        // -----------------------------------------
        // FOLIO ENCONTRADO
        // -----------------------------------------

        if (resultado.encontrado) {

            nombreInput.value =
                resultado.nombre || "";


            nombreInput.setAttribute(
                "readonly",
                true
            );


            mostrarMensaje(
                "Folio encontrado.",
                "exito"
            );


            actividadInput.focus();

        }


        // -----------------------------------------
        // FOLIO NO ENCONTRADO
        // -----------------------------------------

        else {

            nombreInput.value = "";

            nombreInput.removeAttribute(
                "readonly"
            );


            mostrarMensaje(
                "Folio nuevo. Escribe el nombre.",
                "info"
            );


            nombreInput.focus();

        }


    } catch (error) {

        console.error(error);


        mostrarMensaje(
            "Error al consultar: " +
            error.message,
            "error"
        );

    }

}


// =====================================================
// BOTÓN REGISTRAR
// =====================================================

btnRegistrar.addEventListener(
    "click",
    registrar
);


// =====================================================
// FUNCIÓN REGISTRAR
// =====================================================

async function registrar() {

    const folio =
        folioInput.value.trim();


    // ---------------------------------------------
    // VALIDAR FOLIO
    // ---------------------------------------------

    if (folio === "") {

        mostrarMensaje(
            "Ingresa un folio.",
            "error"
        );

        folioInput.focus();

        return;

    }


    let nombre = "-";

    let actividad = "-";


    // ---------------------------------------------
    // DATOS DE ENTRADA
    // ---------------------------------------------

    if (modoActual === "ENTRADA") {

        nombre =
            nombreInput.value.trim();

        actividad =
            actividadInput.value.trim();


        if (nombre === "") {

            mostrarMensaje(
                "Ingresa el nombre.",
                "error"
            );

            nombreInput.focus();

            return;

        }


        if (actividad === "") {

            mostrarMensaje(
                "Ingresa la actividad.",
                "error"
            );

            actividadInput.focus();

            return;

        }

    }


    // ---------------------------------------------
    // BLOQUEAR BOTÓN
    // ---------------------------------------------

    btnRegistrar.disabled = true;

    btnRegistrar.textContent =
        "REGISTRANDO...";


    mostrarMensaje(
        "Enviando información...",
        "info"
    );


    // ---------------------------------------------
    // DATOS PARA GOOGLE SHEETS
    // ---------------------------------------------

    const datos = {

        modo: modoActual,

        folio: folio,

        nombre: nombre,

        actividad: actividad

    };


    try {

        const respuesta =
            await fetch(
                URL_SCRIPT,
                {
                    method: "POST",

                    body: JSON.stringify(datos)
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error de comunicación con Google Apps Script."
            );

        }


        const resultado =
            await respuesta.json();


        // -----------------------------------------
        // REGISTRO CORRECTO
        // -----------------------------------------

        if (resultado.status === "ok") {

            mostrarMensaje(
                resultado.mensaje ||
                "Registro realizado correctamente.",
                "exito"
            );


            setTimeout(
                regresarMenu,
                1500
            );

        }


        // -----------------------------------------
        // ERROR DEL SERVIDOR
        // -----------------------------------------

        else {

            throw new Error(
                resultado.error ||
                "Google Sheets no pudo guardar el registro."
            );

        }


    } catch (error) {

        console.error(error);


        mostrarMensaje(
            "Error al registrar: " +
            error.message,
            "error"
        );


        btnRegistrar.disabled = false;

        btnRegistrar.textContent =
            "REGISTRAR";

    }

}


// =====================================================
// CANCELAR
// =====================================================

btnCancelar.addEventListener(
    "click",
    regresarMenu
);


// =====================================================
// REGRESAR AL MENÚ
// =====================================================

function regresarMenu() {

    formulario.classList.add("oculto");

    menuPrincipal.classList.remove("oculto");


    folioInput.value = "";

    nombreInput.value = "";

    actividadInput.value = "";


    nombreInput.setAttribute(
        "readonly",
        true
    );


    mostrarMensaje("", "");


    btnRegistrar.disabled = false;

    btnRegistrar.textContent =
        "REGISTRAR";


    modoActual = "";

}


// =====================================================
// MOSTRAR MENSAJES
// =====================================================

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent = texto;

    mensaje.className =
        "mensaje";


    if (tipo !== "") {

        mensaje.classList.add(tipo);

    }

}

