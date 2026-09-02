// ======================================================
// CONFIGURACIÓN
// ======================================================

const URL_APPS_SCRIPT =
    "https://script.google.com/macros/s/AKfycby8wUcojpvdzRwuydG2NC1KQBF_WCZggVEDwImcjZyjjUMgWRQFIPKPbrFfg6DLe5cbKQ/exec";


// ======================================================
// VARIABLES
// ======================================================

let modoActual = "";
let folioActual = "";
let nombreActual = "";
let actividadActual = "";


// ======================================================
// ELEMENTOS
// ======================================================

const pantallaInicio =
    document.getElementById("pantallaInicio");

const pantallaFolio =
    document.getElementById("pantallaFolio");

const pantallaNuevoUsuario =
    document.getElementById("pantallaNuevoUsuario");

const pantallaNombre =
    document.getElementById("pantallaNombre");

const pantallaActividades =
    document.getElementById("pantallaActividades");

const pantallaSubmenu =
    document.getElementById("pantallaSubmenu");

const pantallaConfirmacion =
    document.getElementById("pantallaConfirmacion");

const folio =
    document.getElementById("folio");

const nombreNuevo =
    document.getElementById("nombreNuevo");

const folioNuevo =
    document.getElementById("folioNuevo");

const nombreEncontrado =
    document.getElementById("nombreEncontrado");

const tituloSubmenu =
    document.getElementById("tituloSubmenu");

const listaSubmenu =
    document.getElementById("listaSubmenu");

const resumenFolio =
    document.getElementById("resumenFolio");

const resumenNombre =
    document.getElementById("resumenNombre");

const resumenActividad =
    document.getElementById("resumenActividad");

const mensaje =
    document.getElementById("mensaje");

const btnBuscar =
    document.getElementById("btnBuscar");

const btnGuardarUsuario =
    document.getElementById("btnGuardarUsuario");

const btnConfirmarRegistro =
    document.getElementById("btnConfirmarRegistro");


// ======================================================
// SUBMENÚS
// ======================================================

const prepaAbierta = [];

for (let i = 1; i <= 21; i++) {
    prepaAbierta.push(String(i));
}


const prepaLinea = [
    "Propedéutico"
];

for (let i = 1; i <= 23; i++) {
    prepaLinea.push(String(i));
}


const materiasAsesoria = [
    "Matemáticas",
    "Español",
    "Historia",
    "Química",
    "Biología"
];


// ======================================================
// INICIO - ENTRADA
// ======================================================

document
    .getElementById("btnEntrada")
    .addEventListener("click", function () {

        iniciarProceso("ENTRADA");

    });


// ======================================================
// INICIO - SALIDA
// ======================================================

document
    .getElementById("btnSalida")
    .addEventListener("click", function () {

        iniciarProceso("SALIDA");

    });


// ======================================================
// INICIAR PROCESO
// ======================================================

function iniciarProceso(modo) {

    modoActual = modo;

    limpiarDatos();

    mostrarPantalla(pantallaFolio);

    document.getElementById(
        "tituloFolio"
    ).textContent =
        modo === "ENTRADA"
            ? "Registrar entrada"
            : "Registrar salida";

    folio.focus();
}


// ======================================================
// BUSCAR FOLIO
// ======================================================

btnBuscar.addEventListener(
    "click",
    buscarFolio
);


folio.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            buscarFolio();

        }

    }
);


async function buscarFolio() {

    const valor =
        folio.value.trim();


    if (!valor) {

        mostrarMensaje(
            "Escribe un folio.",
            "error"
        );

        folio.focus();

        return;
    }


    folioActual = valor;


    mostrarMensaje(
        "Buscando folio...",
        "info"
    );


    btnBuscar.disabled = true;


    try {

        const url =
            URL_APPS_SCRIPT +
            "?accion=buscar&folio=" +
            encodeURIComponent(
                folioActual
            );


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
            "Respuesta de Google:",
            datos
        );


        // ==================================================
        // SALIDA
        // ==================================================

        if (modoActual === "SALIDA") {

            if (!datos.encontrado) {

                mostrarMensaje(
                    "El folio no está registrado.",
                    "error"
                );

                return;
            }


            nombreActual =
                datos.nombre || "";


            // DIRECTAMENTE REGISTRAR SALIDA

            await registrarSalida();

            return;
        }


        // ==================================================
        // ENTRADA
        // ==================================================

        if (modoActual === "ENTRADA") {


            // ----------------------------------------------
            // FOLIO EXISTE
            // ----------------------------------------------

            if (datos.encontrado) {

                nombreActual =
                    datos.nombre || "";


                console.log(
                    "Usuario encontrado:",
                    nombreActual
                );


                // DIRECTAMENTE A ACTIVIDADES

                mostrarActividades();

                return;
            }


            // ----------------------------------------------
            // FOLIO NO EXISTE
            // ----------------------------------------------

            folioNuevo.textContent =
                folioActual;


            nombreNuevo.value = "";


            mostrarPantalla(
                pantallaNuevoUsuario
            );


            setTimeout(
                function () {

                    nombreNuevo.focus();

                },
                100
            );

        }

    }

    catch (error) {

        console.error(
            "Error buscando folio:",
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
// GUARDAR NUEVO USUARIO
// ======================================================

btnGuardarUsuario.addEventListener(
    "click",
    guardarNuevoUsuario
);


nombreNuevo.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            guardarNuevoUsuario();

        }

    }
);


async function guardarNuevoUsuario() {

    const nombre =
        nombreNuevo.value.trim();


    if (!nombre) {

        mostrarMensaje(
            "Escribe el nombre.",
            "error"
        );

        nombreNuevo.focus();

        return;
    }


    nombreActual =
        nombre;


    btnGuardarUsuario.disabled =
        true;


    mostrarMensaje(
        "Guardando usuario...",
        "info"
    );


    const datos = {

        accion: "registrarUsuario",

        folio: folioActual,

        nombre: nombreActual

    };


    try {

        const respuesta =
            await fetch(
                URL_APPS_SCRIPT,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(datos)

                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Registro usuario:",
            resultado
        );


        if (
            resultado.status !== "ok"
        ) {

            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo guardar el usuario."
            );

        }


        // ==============================================
        // YA GUARDÓ EL FOLIO Y NOMBRE
        // AHORA VA DIRECTAMENTE A ACTIVIDADES
        // ==============================================

        mostrarActividades();

    }

    catch (error) {

        console.error(
            "Error guardando usuario:",
            error
        );


        mostrarMensaje(
            error.message ||
            "No se pudo guardar el usuario.",
            "error"
        );

    }

    finally {

        btnGuardarUsuario.disabled =
            false;

    }

}


// ======================================================
// MOSTRAR ACTIVIDADES
// ======================================================

function mostrarActividades() {

    mostrarPantalla(
        pantallaActividades
    );

}


// ======================================================
// ACTIVIDADES
// ======================================================

document
    .querySelectorAll(
        "#listaActividades .opcion"
    )
    .forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const actividad =
                        boton.dataset.actividad;

                    const menu =
                        boton.dataset.menu;


                    // ACTIVIDAD NORMAL

                    if (actividad) {

                        seleccionarActividad(
                            actividad
                        );

                        return;
                    }


                    // PREPA ABIERTA

                    if (
                        menu ===
                        "prepaAbierta"
                    ) {

                        abrirSubmenu(
                            "Prepa Abierta",
                            prepaAbierta,
                            "Prepa Abierta"
                        );

                    }


                    // PREPA EN LÍNEA

                    if (
                        menu ===
                        "prepaLinea"
                    ) {

                        abrirSubmenu(
                            "Prepa en Línea",
                            prepaLinea,
                            "Prepa en Línea"
                        );

                    }


                    // ASESORÍAS

                    if (
                        menu ===
                        "asesorias"
                    ) {

                        abrirSubmenu(
                            "Asesorías",
                            materiasAsesoria,
                            "Asesorías"
                        );

                    }

                }
            );

        }
    );


// ======================================================
// ABRIR SUBMENÚ
// ======================================================

function abrirSubmenu(
    titulo,
    opciones,
    prefijo
) {

    tituloSubmenu.textContent =
        titulo;


    listaSubmenu.innerHTML = "";


    opciones.forEach(
        function (opcion) {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type = "button";

            boton.className =
                "opcion";


            boton.textContent =
                opcion;


            boton.addEventListener(
                "click",
                function () {

                    seleccionarActividad(
                        prefijo +
                        " - " +
                        opcion
                    );

                }
            );


            listaSubmenu.appendChild(
                boton
            );

        }
    );


    mostrarPantalla(
        pantallaSubmenu
    );

}


// ======================================================
// SELECCIONAR ACTIVIDAD
// ======================================================

function seleccionarActividad(
    actividad
) {

    actividadActual =
        actividad;


    resumenFolio.textContent =
        folioActual;


    resumenNombre.textContent =
        nombreActual;


    resumenActividad.textContent =
        actividadActual;


    mostrarPantalla(
        pantallaConfirmacion
    );

}


// ======================================================
// REGISTRAR ENTRADA
// ======================================================

btnConfirmarRegistro.addEventListener(
    "click",
    registrarEntrada
);


async function registrarEntrada() {

    const datos = {

        accion: "registrarEntrada",

        modo: "ENTRADA",

        folio: folioActual,

        nombre: nombreActual,

        actividad: actividadActual

    };


    btnConfirmarRegistro.disabled =
        true;


    mostrarMensaje(
        "Registrando entrada...",
        "info"
    );


    try {

        const respuesta =
            await fetch(
                URL_APPS_SCRIPT,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(datos)

                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Entrada:",
            resultado
        );


        if (
            resultado.status !== "ok"
        ) {

            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo registrar la entrada."
            );

        }


        mostrarMensaje(
            "✓ ENTRADA REGISTRADA CORRECTAMENTE",
            "exito"
        );


        setTimeout(
            volverInicio,
            1800
        );

    }

    catch (error) {

        console.error(
            "Error registrando entrada:",
            error
        );


        mostrarMensaje(
            error.message ||
            "No se pudo registrar la entrada.",
            "error"
        );


        btnConfirmarRegistro.disabled =
            false;

    }

}


// ======================================================
// REGISTRAR SALIDA
// ======================================================

async function registrarSalida() {

    const datos = {

        accion: "registrarSalida",

        modo: "SALIDA",

        folio: folioActual,

        nombre: nombreActual,

        actividad: "-"

    };


    mostrarMensaje(
        "Registrando salida...",
        "info"
    );


    try {

        const respuesta =
            await fetch(
                URL_APPS_SCRIPT,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(datos)

                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Salida:",
            resultado
        );


        if (
            resultado.status !== "ok"
        ) {

            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo registrar la salida."
            );

        }


        mostrarMensaje(
            "✓ SALIDA REGISTRADA CORRECTAMENTE",
            "exito"
        );


        setTimeout(
            volverInicio,
            1800
        );

    }

    catch (error) {

        console.error(
            "Error registrando salida:",
            error
        );


        mostrarMensaje(
            error.message ||
            "No se pudo registrar la salida.",
            "error"
        );

    }

}


// ======================================================
// REGRESAR
// ======================================================

document
    .getElementById(
        "btnRegresarActividades"
    )
    .addEventListener(
        "click",
        function () {

            mostrarPantalla(
                pantallaFolio
            );

        }
    );


document
    .getElementById(
        "btnRegresarSubmenu"
    )
    .addEventListener(
        "click",
        function () {

            mostrarPantalla(
                pantallaActividades
            );

        }
    );


document
    .getElementById(
        "btnRegresarConfirmacion"
    )
    .addEventListener(
        "click",
        function () {

            mostrarPantalla(
                pantallaActividades
            );

        }
    );


// ======================================================
// CANCELAR
// ======================================================

document
    .getElementById(
        "btnCancelarFolio"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnCancelarNuevo"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnCancelarNombre"
    )
    .addEventListener(
        "click",
        volverInicio
    );


// ======================================================
// MOSTRAR PANTALLA
// ======================================================

function mostrarPantalla(
    pantalla
) {

    const pantallas = [

        pantallaInicio,

        pantallaFolio,

        pantallaNuevoUsuario,

        pantallaNombre,

        pantallaActividades,

        pantallaSubmenu,

        pantallaConfirmacion

    ];


    pantallas.forEach(
        function (elemento) {

            elemento.classList.add(
                "oculto"
            );

        }
    );


    pantalla.classList.remove(
        "oculto"
    );


    mensaje.textContent = "";

    mensaje.className =
        "mensaje";

}


// ======================================================
// MENSAJE
// ======================================================

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent =
        texto;

    mensaje.className =
        "mensaje " + tipo;

}


// ======================================================
// VOLVER AL INICIO
// ======================================================

function volverInicio() {

    limpiarDatos();

    mostrarPantalla(
        pantallaInicio
    );

}


// ======================================================
// LIMPIAR
// ======================================================

function limpiarDatos() {

    modoActual = "";

    folioActual = "";

    nombreActual = "";

    actividadActual = "";

    folio.value = "";

    nombreNuevo.value = "";

    nombreEncontrado.textContent = "";

    folioNuevo.textContent = "";

    resumenFolio.textContent = "";

    resumenNombre.textContent = "";

    resumenActividad.textContent = "";

}
