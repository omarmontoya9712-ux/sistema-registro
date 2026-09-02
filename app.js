// ============================================
// CONFIGURACIÓN
// ============================================

const URL_GOOGLE =
"https://script.google.com/macros/s/AKfycby8wUcojpvdzRwuydG2NC1KQBF_WCZggVEDwImcjZyjjUMgWRQFIPKPbrFfg6DLe5cbKQ/exec";


// ============================================
// VARIABLES
// ============================================

let modoActual = "";

let folioActual = "";

let nombreActual = "";

let lectorQR = null;


// ============================================
// ELEMENTOS
// ============================================

const menuPrincipal =
    document.getElementById("menuPrincipal");

const opcionesFolio =
    document.getElementById("opcionesFolio");

const pantallaManual =
    document.getElementById("pantallaManual");

const pantallaQR =
    document.getElementById("pantallaQR");

const formularioEntrada =
    document.getElementById("formularioEntrada");

const pantallaActividades =
    document.getElementById("pantallaActividades");

const pantallaSubmenu =
    document.getElementById("pantallaSubmenu");

const folioInput =
    document.getElementById("folio");

const nombreInput =
    document.getElementById("nombre");

const mensajeEntrada =
    document.getElementById("mensajeEntrada");


// ============================================
// CAMBIAR PANTALLA
// ============================================

function mostrarPantalla(pantalla) {

    const pantallas = [
        menuPrincipal,
        opcionesFolio,
        pantallaManual,
        pantallaQR,
        formularioEntrada,
        pantallaActividades,
        pantallaSubmenu
    ];

    pantallas.forEach(p => {
        p.classList.add("oculto");
    });

    pantalla.classList.remove("oculto");
}


// ============================================
// INICIO
// ============================================

function volverInicio() {

    detenerQR();

    modoActual = "";

    folioActual = "";

    nombreActual = "";

    folioInput.value = "";

    nombreInput.value = "";

    mensajeEntrada.textContent = "";

    mostrarPantalla(menuPrincipal);
}


// ============================================
// ENTRADA
// ============================================

document
    .getElementById("btnEntrada")
    .addEventListener("click", function () {

        modoActual = "ENTRADA";

        document.getElementById("tituloFolio").textContent =
            "Registro de Entrada";

        mostrarPantalla(opcionesFolio);
    });


// ============================================
// SALIDA
// ============================================

document
    .getElementById("btnSalida")
    .addEventListener("click", function () {

        modoActual = "SALIDA";

        document.getElementById("tituloFolio").textContent =
            "Registro de Salida";

        mostrarPantalla(opcionesFolio);
    });


// ============================================
// FOLIO MANUAL
// ============================================

document
    .getElementById("btnManual")
    .addEventListener("click", function () {

        folioInput.value = "";

        mostrarPantalla(pantallaManual);

        setTimeout(() => {
            folioInput.focus();
        }, 100);
    });


// ============================================
// CONTINUAR FOLIO
// ============================================

document
    .getElementById("btnContinuarFolio")
    .addEventListener("click", function () {

        procesarFolio(
            folioInput.value.trim()
        );
    });


// ENTER EN FOLIO
folioInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        procesarFolio(
            folioInput.value.trim()
        );
    }
});


// ============================================
// QR
// ============================================

document
    .getElementById("btnQR")
    .addEventListener("click", function () {

        iniciarQR();

    });


// ============================================
// INICIAR ESCANEO
// ============================================

function iniciarQR() {

    mostrarPantalla(pantallaQR);

    document
        .getElementById("qrExito")
        .classList.add("oculto");

    lectorQR = new Html5Qrcode("reader");

    lectorQR.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },

        function(decodedText) {

            // QR leído correctamente
            folioActual = decodedText.trim();

            document
                .getElementById("qrExito")
                .classList.remove("oculto");

            // detener cámara
            detenerQR();

            // esperar un momento para mostrar éxito
            setTimeout(function () {

                procesarFolio(folioActual);

            }, 700);

        },

        function(errorMessage) {

            // errores normales del lector
            // no mostramos nada

        }

    ).catch(function(error) {

        alert(
            "No se pudo acceder a la cámara. " +
            "Verifica los permisos del navegador."
        );

    });
}


// ============================================
// DETENER QR
// ============================================

function detenerQR() {

    if (lectorQR) {

        lectorQR.stop()
            .then(() => {

                lectorQR.clear();

                lectorQR = null;

            })
            .catch(() => {

                lectorQR = null;

            });
    }
}


// ============================================
// PROCESAR FOLIO
// ============================================

function procesarFolio(folio) {

    if (!folio) {

        alert("Debes ingresar o escanear un folio.");

        return;
    }

    folioActual = folio;

    if (modoActual === "SALIDA") {

        registrarSalida();

        return;
    }

    if (modoActual === "ENTRADA") {

        buscarFolio();

    }
}


// ============================================
// BUSCAR FOLIO
// ============================================

function buscarFolio() {

    mostrarPantalla(formularioEntrada);

    mensajeEntrada.className =
        "mensaje info";

    mensajeEntrada.textContent =
        "Buscando folio...";

    fetch(
        URL_GOOGLE +
        "?accion=buscar&folio=" +
        encodeURIComponent(folioActual)
    )

    .then(response => response.json())

    .then(data => {

        console.log(data);

        // ====================================
        // FOLIO EXISTE
        // ====================================

        if (data.encontrado === true) {

            nombreActual = data.nombre;

            mensajeEntrada.className =
                "mensaje exito";

            mensajeEntrada.textContent =
                "Folio encontrado.";

            // No pedir nombre
            nombreInput.value = nombreActual;

            document
                .getElementById("campoNombre")
                .classList.add("oculto");

            document
                .getElementById("btnNombre")
                .classList.add("oculto");

            // Ir directamente a actividades
            setTimeout(function () {

                mostrarPantalla(
                    pantallaActividades
                );

            }, 500);

        }

        // ====================================
        // FOLIO NO EXISTE
        // ====================================

        else {

            nombreInput.value = "";

            document
                .getElementById("campoNombre")
                .classList.remove("oculto");

            document
                .getElementById("btnNombre")
                .classList.remove("oculto");

            mensajeEntrada.className =
                "mensaje info";

            mensajeEntrada.textContent =
                "Folio nuevo. Ingresa el nombre.";

            setTimeout(function () {

                nombreInput.focus();

            }, 100);

        }

    })

    .catch(function(error) {

        console.error(error);

        mensajeEntrada.className =
            "mensaje error";

        mensajeEntrada.textContent =
            "No se pudo conectar con Google Sheets.";

    });
}


// ============================================
// REGISTRAR NUEVO NOMBRE
// ============================================

document
    .getElementById("btnNombre")
    .addEventListener("click", function () {

        const nombre =
            nombreInput.value.trim();

        if (!nombre) {

            mensajeEntrada.className =
                "mensaje error";

            mensajeEntrada.textContent =
                "Escribe el nombre.";

            return;
        }

        nombreActual = nombre;

        // Guardamos primero el usuario
        guardarNuevoUsuario();

    });


// ============================================
// GUARDAR USUARIO NUEVO
// ============================================

function guardarNuevoUsuario() {

    mensajeEntrada.className =
        "mensaje info";

    mensajeEntrada.textContent =
        "Registrando usuario...";

    fetch(URL_GOOGLE, {

        method: "POST",

        body: JSON.stringify({

            modo: "ENTRADA",

            folio: folioActual,

            nombre: nombreActual,

            actividad: ""

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if (data.error) {

            mensajeEntrada.className =
                "mensaje error";

            mensajeEntrada.textContent =
                data.error;

            return;
        }

        // Ahora actividades
        mostrarPantalla(
            pantallaActividades
        );

    })

    .catch(function(error) {

        console.error(error);

        mensajeEntrada.className =
            "mensaje error";

        mensajeEntrada.textContent =
            "Error al registrar el usuario.";

    });
}


// ============================================
// ACTIVIDAD NORMAL
// ============================================

document
    .querySelectorAll(".actividad[data-actividad]")
    .forEach(function(boton) {

        boton.addEventListener("click", function() {

            const actividad =
                boton.dataset.actividad;

            registrarEntrada(actividad);

        });

    });


// ============================================
// PREPA ABIERTA
// ============================================

document
    .getElementById("btnPrepaAbierta")
    .addEventListener("click", function() {

        crearSubmenu(
            "Prepa Abierta",
            crearNumeros(1, 21)
        );

    });


// ============================================
// PREPA EN LINEA
// ============================================

document
    .getElementById("btnPrepaLinea")
    .addEventListener("click", function() {

        const opciones = [
            "Propedéutico"
        ];

        for (let i = 1; i <= 23; i++) {

            opciones.push(String(i));

        }

        crearSubmenu(
            "Prepa en Línea",
            opciones
        );

    });


// ============================================
// ASESORÍAS
// ============================================

document
    .getElementById("btnAsesoria")
    .addEventListener("click", function() {

        crearSubmenu(
            "Asesorías",
            [
                "Matemáticas",
                "Español",
                "Historia",
                "Química",
                "Biología"
            ]
        );

    });


// ============================================
// CREAR NUMEROS
// ============================================

function crearNumeros(inicio, fin) {

    const array = [];

    for (let i = inicio; i <= fin; i++) {

        array.push(String(i));

    }

    return array;
}


// ============================================
// CREAR SUBMENU
// ============================================

function crearSubmenu(titulo, opciones) {

    document
        .getElementById("tituloSubmenu")
        .textContent = titulo;

    const contenedor =
        document.getElementById("botonesSubmenu");

    contenedor.innerHTML = "";

    opciones.forEach(function(opcion) {

        const boton =
            document.createElement("button");

        boton.className =
            "boton actividad";

        boton.textContent =
            opcion;

        boton.addEventListener(
            "click",
            function() {

                const actividad =
                    titulo + " - " + opcion;

                registrarEntrada(actividad);

            }
        );

        contenedor.appendChild(boton);

    });

    mostrarPantalla(pantallaSubmenu);
}


// ============================================
// REGISTRAR ENTRADA
// ============================================

function registrarEntrada(actividad) {

    fetch(URL_GOOGLE, {

        method: "POST",

        body: JSON.stringify({

            modo: "ENTRADA",

            folio: folioActual,

            nombre: nombreActual,

            actividad: actividad

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if (data.error) {

            alert(data.error);

            return;
        }

        alert(
            "✓ Entrada registrada\n\n" +
            actividad
        );

        volverInicio();

    })

    .catch(function(error) {

        console.error(error);

        alert(
            "No se pudo registrar la entrada."
        );

    });
}


// ============================================
// REGISTRAR SALIDA
// ============================================

function registrarSalida() {

    fetch(URL_GOOGLE, {

        method: "POST",

        body: JSON.stringify({

            modo: "SALIDA",

            folio: folioActual,

            nombre: "",

            actividad: ""

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if (data.error) {

            alert(data.error);

            return;
        }

        alert(
            "✓ Salida registrada"
        );

        volverInicio();

    })

    .catch(function(error) {

        console.error(error);

        alert(
            "No se pudo registrar la salida."
        );

    });
}


// ============================================
// BOTONES CANCELAR
// ============================================

document
    .getElementById("btnCancelarFolio")
    .addEventListener("click", volverInicio);

document
    .getElementById("btnCancelarManual")
    .addEventListener("click", volverInicio);

document
    .getElementById("btnCancelarQR")
    .addEventListener("click", volverInicio);

document
    .getElementById("btnCancelarEntrada")
    .addEventListener("click", volverInicio);

document
    .getElementById("btnCancelarActividad")
    .addEventListener("click", volverInicio);

document
    .getElementById("btnVolverActividades")
    .addEventListener("click", function() {

        mostrarPantalla(
            pantallaActividades
        );

    });
