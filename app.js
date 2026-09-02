// ==========================================
// CONFIGURACIÓN
// ==========================================

const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxMUREOWwMkhq-0fxnS5lsP5XDHoz3xZLkHVxgzrpVGmx258nyc4eZBzOok0EWLTWPSOQ/exec";


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const btnEntrada = document.getElementById("btnEntrada");
const btnSalida = document.getElementById("btnSalida");

const menuPrincipal = document.getElementById("menuPrincipal");
const formulario = document.getElementById("formulario");

const tituloFormulario = document.getElementById("tituloFormulario");

const folioInput = document.getElementById("folio");
const nombreInput = document.getElementById("nombre");
const actividadInput = document.getElementById("actividad");

const campoNombre = document.getElementById("campoNombre");
const campoActividad = document.getElementById("campoActividad");

const mensaje = document.getElementById("mensaje");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnCancelar = document.getElementById("btnCancelar");


// ==========================================
// VARIABLE PARA SABER SI ES ENTRADA O SALIDA
// ==========================================

let modoActual = "";


// ==========================================
// BOTÓN ENTRADA
// ==========================================

btnEntrada.addEventListener("click", () => {

    modoActual = "ENTRADA";

    menuPrincipal.classList.add("oculto");
    formulario.classList.remove("oculto");

    tituloFormulario.textContent = "Registrar Entrada";

    campoNombre.classList.remove("oculto");
    campoActividad.classList.remove("oculto");

    nombreInput.value = "";
    actividadInput.value = "";
    folioInput.value = "";

    mostrarMensaje("", "");

    folioInput.focus();
});


// ==========================================
// BOTÓN SALIDA
// ==========================================

btnSalida.addEventListener("click", () => {

    modoActual = "SALIDA";

    menuPrincipal.classList.add("oculto");
    formulario.classList.remove("oculto");

    tituloFormulario.textContent = "Registrar Salida";

    campoNombre.classList.add("oculto");
    campoActividad.classList.add("oculto");

    nombreInput.value = "";
    actividadInput.value = "";
    folioInput.value = "";

    mostrarMensaje("", "");

    folioInput.focus();
});


// ==========================================
// BUSCAR FOLIO
// ==========================================

folioInput.addEventListener("blur", buscarFolio);

folioInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        buscarFolio();
    }

});


async function buscarFolio() {

    const folio = folioInput.value.trim();

    if (folio === "") {
        return;
    }

    // Para SALIDA no necesitamos mostrar nombre
    if (modoActual === "SALIDA") {
        mostrarMensaje("Folio listo para registrar salida.", "info");
        return;
    }

    mostrarMensaje("Buscando folio...", "info");

    nombreInput.value = "";

    try {

        const url =
            URL_SCRIPT +
            "?accion=buscar&folio=" +
            encodeURIComponent(folio);

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con Google Sheets.");
        }

        const resultado = await respuesta.json();

        if (resultado.encontrado) {

            nombreInput.value = resultado.nombre || "";

            mostrarMensaje(
                "Folio encontrado.",
                "exito"
            );

            actividadInput.focus();

        } else {

            nombreInput.value = "";

            mostrarMensaje(
                "Folio no encontrado. Escribe el nombre manualmente.",
                "error"
            );

            /*
             * Tu HTML actual tiene el campo nombre como readonly.
             * Lo hacemos editable si el folio es nuevo.
             */
            nombreInput.removeAttribute("readonly");

            nombreInput.focus();
        }

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "Error al consultar Google Sheets: " + error.message,
            "error"
        );
    }
}


// ==========================================
// REGISTRAR
// ==========================================

btnRegistrar.addEventListener("click", registrar);


async function registrar() {

    const folio = folioInput.value.trim();

    if (folio === "") {

        mostrarMensaje(
            "Ingresa un folio.",
            "error"
        );

        folioInput.focus();

        return;
    }


    let nombre = "";
    let actividad = "";


    // --------------------------------------
    // DATOS PARA ENTRADA
    // --------------------------------------

    if (modoActual === "ENTRADA") {

        nombre = nombreInput.value.trim();
        actividad = actividadInput.value.trim();


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


    // --------------------------------------
    // DESACTIVAR BOTÓN
    // --------------------------------------

    btnRegistrar.disabled = true;

    btnRegistrar.textContent = "REGISTRANDO...";

    mostrarMensaje(
        "Enviando información...",
        "info"
    );


    // --------------------------------------
    // DATOS QUE SE ENVIARÁN A APPS SCRIPT
    // --------------------------------------

    const datos = {

        modo: modoActual,

        folio: folio,

        nombre: nombre || "-",

        actividad: actividad || "-"

    };


    try {

        const respuesta = await fetch(URL_SCRIPT, {

            method: "POST",

            body: JSON.stringify(datos)

        });


        if (!respuesta.ok) {

            throw new Error(
                "Google Apps Script respondió con un error."
            );

        }


        const resultado = await respuesta.json();


        if (resultado.status === "ok") {

            mostrarMensaje(
                resultado.mensaje || "Registro realizado correctamente.",
                "exito"
            );


            // Limpiar formulario después de registrar

            setTimeout(() => {

                formulario.classList.add("oculto");

                menuPrincipal.classList.remove("oculto");

                folioInput.value = "";

                nombreInput.value = "";

                actividadInput.value = "";

                nombreInput.setAttribute("readonly", true);

                mostrarMensaje("", "");

                btnRegistrar.disabled = false;

                btnRegistrar.textContent = "REGISTRAR";

            }, 1500);


        } else {

            throw new Error(
                resultado.error ||
                "No se pudo registrar la información."
            );

        }


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "Error al registrar: " + error.message,
            "error"
        );

        btnRegistrar.disabled = false;

        btnRegistrar.textContent = "REGISTRAR";
    }

}


// ==========================================
// BOTÓN CANCELAR
// ==========================================

btnCancelar.addEventListener("click", () => {

    formulario.classList.add("oculto");

    menuPrincipal.classList.remove("oculto");

    folioInput.value = "";

    nombreInput.value = "";

    actividadInput.value = "";

    nombreInput.setAttribute("readonly", true);

    mostrarMensaje("", "");

    btnRegistrar.disabled = false;

    btnRegistrar.textContent = "REGISTRAR";

    modoActual = "";
});


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;

    mensaje.className = "mensaje";

    if (tipo !== "") {
        mensaje.classList.add(tipo);
    }

}
