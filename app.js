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


const tituloFolio =
    document.getElementById("tituloFolio");


const mensajeFolio =
    document.getElementById("mensajeFolio");


const mensajeNuevo =
    document.getElementById("mensajeNuevo");


const mensajeRegistro =
    document.getElementById("mensajeRegistro");


const btnBuscar =
    document.getElementById("btnBuscar");


const btnGuardarUsuario =
    document.getElementById("btnGuardarUsuario");


const btnConfirmarRegistro =
    document.getElementById(
        "btnConfirmarRegistro"
    );


const tituloSubmenu =
    document.getElementById(
        "tituloSubmenu"
    );


const listaSubmenu =
    document.getElementById(
        "listaSubmenu"
    );


const resumenFolio =
    document.getElementById(
        "resumenFolio"
    );


const resumenNombre =
    document.getElementById(
        "resumenNombre"
    );


const resumenActividad =
    document.getElementById(
        "resumenActividad"
    );


// ======================================================
// SUBMENÚS
// ======================================================

const prepaAbierta = [];

for (let i = 1; i <= 21; i++) {

    prepaAbierta.push(
        String(i)
    );

}


const prepaLinea = [
    "Propedéutico"
];

for (let i = 1; i <= 23; i++) {

    prepaLinea.push(
        String(i)
    );

}


const materiasAsesoria = [

    "Matemáticas",

    "Español",

    "Historia",

    "Química",

    "Biología"

];


// ======================================================
// ENTRADA
// ======================================================

document
    .getElementById("btnEntrada")
    .addEventListener(
        "click",
        function () {

            iniciarProceso(
                "ENTRADA"
            );

        }
    );


// ======================================================
// SALIDA
// ======================================================

document
    .getElementById("btnSalida")
    .addEventListener(
        "click",
        function () {

            iniciarProceso(
                "SALIDA"
            );

        }
    );


// ======================================================
// INICIAR PROCESO
// ======================================================

function iniciarProceso(
    modo
) {

    modoActual = modo;

    folioActual = "";

    nombreActual = "";

    actividadActual = "";

    folio.value = "";

    nombreNuevo.value = "";

    limpiarMensajes();


    tituloFolio.textContent =
        modo === "ENTRADA"
            ? "Registrar entrada"
            : "Registrar salida";


    mostrarPantalla(
        pantallaFolio
    );


    setTimeout(
        function () {

            folio.focus();

        },
        100
    );

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

        if (
            event.key === "Enter"
        ) {

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
            mensajeFolio,
            "Escribe un folio.",
            "error"
        );

        folio.focus();

        return;

    }


    folioActual = valor;


    mostrarMensaje(
        mensajeFolio,
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
            "Respuesta:",
            datos
        );


        // ==============================================
        // SALIDA
        // ==============================================

        if (
            modoActual === "SALIDA"
        ) {

            if (
                !datos.encontrado
            ) {

                mostrarMensaje(
                    mensajeFolio,
                    "El folio no está registrado.",
                    "error"
                );

                return;

            }


            nombreActual =
                datos.nombre || "";


            await registrarSalida();

            return;

        }


        // ==============================================
        // ENTRADA
        // ==============================================

        if (
            modoActual === "ENTRADA"
        ) {


            // ------------------------------------------
            // FOLIO EXISTE
            // ------------------------------------------

            if (
                datos.encontrado
            ) {

                nombreActual =
                    datos.nombre || "";


                mostrarActividades();

                return;

            }


            // ------------------------------------------
            // FOLIO NUEVO
            // ------------------------------------------

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
            error
        );


        mostrarMensaje(
            mensajeFolio,
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

        if (
            event.key === "Enter"
        ) {

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
            mensajeNuevo,
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
        mensajeNuevo,
        "Guardando usuario...",
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
                        JSON.stringify({

                            accion:
                                "registrarUsuario",

                            folio:
                                folioActual,

                            nombre:
                                nombreActual

                        })

                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "Usuario:",
            resultado
        );


        if (
            resultado.status !== "ok"
        ) {

            throw new Error(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo guardar."
            );

        }


        // IMPORTANTE:
        // NO REGISTRA ENTRADA AQUÍ.
        // SOLAMENTE GUARDA EL USUARIO.


        mostrarActividades();

    }

    catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            mensajeNuevo,
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
// BOTONES DE ACTIVIDADES
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

                        return;

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

                        return;

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


            boton.type =
                "button";


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


    limpiarMensajes();


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

    btnConfirmarRegistro.disabled =
        true;


    mostrarMensaje(
        mensajeRegistro,
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
                        JSON.stringify({

                            accion:
                                "registrarEntrada",

                            modo:
                                "ENTRADA",

                            folio:
                                folioActual,

                            nombre:
                                nombreActual,

                            actividad:
                                actividadActual

                        })

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
                "No se pudo registrar."
            );

        }


        mostrarMensaje(
            mensajeRegistro,
            "✓ ENTRADA REGISTRADA",
            "exito"
        );


        setTimeout(
            volverInicio,
            1800
        );

    }

    catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            mensajeRegistro,
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

    mostrarMensaje(
        mensajeFolio,
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
                        JSON.stringify({

                            accion:
                                "registrarSalida",

                            modo:
                                "SALIDA",

                            folio:
                                folioActual

                        })

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
            mensajeFolio,
            "✓ SALIDA REGISTRADA",
            "exito"
        );


        setTimeout(
            volverInicio,
            1800
        );

    }

    catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            mensajeFolio,
            error.message ||
            "No se pudo registrar la salida.",
            "error"
        );

    }

}


// ======================================================
// REGRESAR DESDE SUBMENÚ
// ======================================================

document
    .getElementById(
        "btnRegresarActividades"
    )
    .addEventListener(
        "click",
        function () {

            mostrarActividades();

        }
    );


// ======================================================
// REGRESAR DESDE CONFIRMACIÓN
// ======================================================

document
    .getElementById(
        "btnRegresarConfirmacion"
    )
    .addEventListener(
        "click",
        function () {

            mostrarActividades();

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
        "btnCancelarActividades"
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

}


// ======================================================
// MENSAJES
// ======================================================

function mostrarMensaje(
    elemento,
    texto,
    tipo
) {

    elemento.textContent =
        texto;

    elemento.className =
        "mensaje " + tipo;

}


function limpiarMensajes() {

    mensajeFolio.textContent = "";

    mensajeFolio.className =
        "mensaje";


    mensajeNuevo.textContent = "";

    mensajeNuevo.className =
        "mensaje";


    mensajeRegistro.textContent = "";

    mensajeRegistro.className =
        "mensaje";

}


// ======================================================
// VOLVER AL INICIO
// ======================================================

function volverInicio() {

    modoActual = "";

    folioActual = "";

    nombreActual = "";

    actividadActual = "";

    folio.value = "";

    nombreNuevo.value = "";

    limpiarMensajes();


    mostrarPantalla(
        pantallaInicio
    );

}
