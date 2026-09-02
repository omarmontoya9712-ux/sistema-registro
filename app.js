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
// ACTIVIDADES
// ======================================================

const actividadesDirectas = [

    "Alfabetización",

    "Primaria INEA",

    "Secundaria INEA",

    "Computación",

    "Uso de computadora",

    "Servicio social",

    "Beneficiarios"

];


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
// BOTONES INICIO
// ======================================================

document
    .getElementById("btnEntrada")
    .addEventListener(
        "click",
        function () {

            iniciarProceso("ENTRADA");

        }
    );


document
    .getElementById("btnSalida")
    .addEventListener(
        "click",
        function () {

            iniciarProceso("SALIDA");

        }
    );


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

document
    .getElementById("btnBuscar")
    .addEventListener(
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
            "Respuesta:",
            datos
        );


        if (datos.error) {

            throw new Error(
                datos.error
            );

        }


        // ==============================================
        // FOLIO ENCONTRADO
        // ==============================================

        if (datos.encontrado) {

            nombreActual =
                datos.nombre || "";


            // SALIDA

            if (modoActual === "SALIDA") {

                mostrarMensaje(
                    "Folio encontrado. Registrando salida...",
                    "info"
                );

                registrarSalida();

                return;

            }


            // ENTRADA

            nombreEncontrado.textContent =
                nombreActual;

            mostrarPantalla(
                pantallaNombre
            );

        }


        // ==============================================
        // FOLIO NO ENCONTRADO
        // ==============================================

        else {

            if (modoActual === "ENTRADA") {

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

            else {

                mostrarMensaje(
                    "El folio no está registrado. No se puede registrar una salida.",
                    "error"
                );

            }

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


    nombreActual = nombre;


    btnGuardarUsuario.disabled = true;


    mostrarMensaje(
        "Guardando usuario...",
        "info"
    );


    /*
     * Enviamos ENTRADA.
     *
     * Tu Apps Script:
     *
     * 1. Guarda el folio y nombre
     *    en BD_USUARIOS.
     *
     * 2. Registra la entrada
     *    en la hoja del día.
     */

    const datos = {

        modo: "ENTRADA",

        folio: folioActual,

        nombre: nombreActual,

        actividad: "-"

    };


    try {

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
         * El usuario ya quedó guardado.
         *
         * Ahora continuamos con la actividad.
         */

        mostrarActividades();


    }

    catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo guardar el usuario.",
            "error"
        );

        btnGuardarUsuario.disabled = false;

    }

}


// ======================================================
// CONTINUAR CON USUARIO EXISTENTE
// ======================================================

document
    .getElementById("btnContinuarActividad")
    .addEventListener(
        "click",
        function () {

            mostrarActividades();

        }
    );


// ======================================================
// MOSTRAR ACTIVIDADES
// ======================================================

function mostrarActividades() {

    mostrarMensaje(
        "",
        ""
    );

    mostrarPantalla(
        pantallaActividades
    );

}


// ======================================================
// ACTIVIDADES DIRECTAS
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


                    // ACTIVIDAD DIRECTA

                    if (actividad) {

                        seleccionarActividad(
                            actividad
                        );

                        return;

                    }


                    // SUBMENÚ

                    if (menu === "prepaAbierta") {

                        abrirSubmenu(
                            "Prepa Abierta",
                            prepaAbierta,
                            "Prepa Abierta"
                        );

                    }


                    if (menu === "prepaLinea") {

                        abrirSubmenu(
                            "Prepa en Línea",
                            prepaLinea,
                            "Prepa en Línea"
                        );

                    }


                    if (menu === "asesorias") {

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
// CONFIRMAR ENTRADA
// ======================================================

btnConfirmarRegistro.addEventListener(
    "click",
    registrarEntrada
);


async function registrarEntrada() {

    const datos = {

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

        console.error(error);

        mostrarMensaje(
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

        modo: "SALIDA",

        folio: folioActual,

        nombre: nombreActual,

        actividad: "-"

    };


    try {

        const respuesta =
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

        console.error(error);

        mostrarMensaje(
            "No se pudo registrar la salida.",
            "error"
        );

    }

}


// ======================================================
// REGRESAR DESDE ACTIVIDADES
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


// ======================================================
// REGRESAR DESDE SUBMENÚ
// ======================================================

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

            mostrarPantalla(
                pantallaActividades
            );

        }
    );


// ======================================================
// CANCELAR FOLIO
// ======================================================

document
    .getElementById(
        "btnCancelarFolio"
    )
    .addEventListener(
        "click",
        volverInicio
    );


// ======================================================
// CANCELAR NUEVO USUARIO
// ======================================================

document
    .getElementById(
        "btnCancelarNuevo"
    )
    .addEventListener(
        "click",
        volverInicio
    );


// ======================================================
// CANCELAR NOMBRE
// ======================================================

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
// MENSAJES
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
// LIMPIAR DATOS
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
