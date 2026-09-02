// =====================================================
// CONFIGURACIÓN
// =====================================================

const URL_GOOGLE =
"https://script.google.com/macros/s/AKfycby8wUcojpvdzRwuydG2NC1KQBF_WCZggVEDwImcjZyjjUMgWRQFIPKPbrFfg6DLe5cbKQ/exec";


// =====================================================
// VARIABLES
// =====================================================

let modoActual = "";

let folioActual = "";

let nombreActual = "";

let lectorQR = null;


// =====================================================
// ELEMENTOS
// =====================================================

const menuPrincipal =
    document.getElementById(
        "menuPrincipal"
    );

const opcionesFolio =
    document.getElementById(
        "opcionesFolio"
    );

const pantallaManual =
    document.getElementById(
        "pantallaManual"
    );

const pantallaQR =
    document.getElementById(
        "pantallaQR"
    );

const formularioEntrada =
    document.getElementById(
        "formularioEntrada"
    );

const pantallaActividades =
    document.getElementById(
        "pantallaActividades"
    );

const pantallaSubmenu =
    document.getElementById(
        "pantallaSubmenu"
    );

const pantallaBienvenida =
    document.getElementById(
        "pantallaBienvenida"
    );

const folioInput =
    document.getElementById(
        "folio"
    );

const nombreInput =
    document.getElementById(
        "nombre"
    );

const mensajeEntrada =
    document.getElementById(
        "mensajeEntrada"
    );


// =====================================================
// FOLIO SIEMPRE EN MAYÚSCULAS
// =====================================================

folioInput.addEventListener(
    "input",
    function() {

        folioInput.value =
            folioInput.value.toUpperCase();

    }
);


// =====================================================
// NOMBRE SIEMPRE EN MAYÚSCULAS
// =====================================================

nombreInput.addEventListener(
    "input",
    function() {

        nombreInput.value =
            nombreInput.value.toUpperCase();

    }
);


// =====================================================
// MOSTRAR UNA PANTALLA
// =====================================================

function mostrarPantalla(pantalla) {

    const pantallas = [

        menuPrincipal,

        opcionesFolio,

        pantallaManual,

        pantallaQR,

        formularioEntrada,

        pantallaActividades,

        pantallaSubmenu,

        pantallaBienvenida

    ];


    pantallas.forEach(
        function(p) {

            p.classList.add(
                "oculto"
            );

        }
    );


    pantalla.classList.remove(
        "oculto"
    );

}


// =====================================================
// VOLVER AL INICIO
// =====================================================

function volverInicio() {

    detenerQR();


    modoActual = "";

    folioActual = "";

    nombreActual = "";


    folioInput.value = "";

    nombreInput.value = "";


    mensajeEntrada.textContent =
        "";


    document
        .getElementById(
            "qrFolio"
        )
        .textContent =
        "";


    document
        .getElementById(
            "qrExito"
        )
        .classList.add(
            "oculto"
        );


    mostrarPantalla(
        menuPrincipal
    );

}


// =====================================================
// ENTRADA
// =====================================================

document
    .getElementById(
        "btnEntrada"
    )
    .addEventListener(
        "click",
        function() {

            modoActual =
                "ENTRADA";


            document
                .getElementById(
                    "tituloFolio"
                )
                .textContent =
                "Registro de Entrada";


            mostrarPantalla(
                opcionesFolio
            );

        }
    );


// =====================================================
// SALIDA
// =====================================================

document
    .getElementById(
        "btnSalida"
    )
    .addEventListener(
        "click",
        function() {

            modoActual =
                "SALIDA";


            document
                .getElementById(
                    "tituloFolio"
                )
                .textContent =
                "Registro de Salida";


            mostrarPantalla(
                opcionesFolio
            );

        }
    );


// =====================================================
// FOLIO MANUAL
// =====================================================

document
    .getElementById(
        "btnManual"
    )
    .addEventListener(
        "click",
        function() {

            folioInput.value =
                "";


            mostrarPantalla(
                pantallaManual
            );


            setTimeout(
                function() {

                    folioInput.focus();

                },
                100
            );

        }
    );


// =====================================================
// CONTINUAR FOLIO
// =====================================================

document
    .getElementById(
        "btnContinuarFolio"
    )
    .addEventListener(
        "click",
        function() {

            procesarFolio(
                folioInput.value
                    .trim()
                    .toUpperCase()
            );

        }
    );


// =====================================================
// ENTER EN FOLIO
// =====================================================

folioInput.addEventListener(
    "keypress",
    function(e) {

        if (
            e.key === "Enter"
        ) {

            procesarFolio(
                folioInput.value
                    .trim()
                    .toUpperCase()
            );

        }

    }
);


// =====================================================
// INICIAR QR
// =====================================================

document
    .getElementById(
        "btnQR"
    )
    .addEventListener(
        "click",
        function() {

            iniciarQR();

        }
    );


function iniciarQR() {

    mostrarPantalla(
        pantallaQR
    );


    document
        .getElementById(
            "qrExito"
        )
        .classList.add(
            "oculto"
        );


    document
        .getElementById(
            "qrFolio"
        )
        .textContent =
        "";


    document
        .getElementById(
            "reader"
        )
        .innerHTML =
        "";


    lectorQR =
        new Html5Qrcode(
            "reader"
        );


    lectorQR.start(

        {
            facingMode:
                "environment"
        },

        {
            fps: 10,

            qrbox: {

                width: 250,

                height: 250

            }

        },

        function(decodedText) {

            // =====================================
            // QR ENCONTRADO
            // =====================================

            folioActual =
                decodedText
                    .trim()
                    .toUpperCase();


            document
                .getElementById(
                    "qrExito"
                )
                .classList.remove(
                    "oculto"
                );


            document
                .getElementById(
                    "qrFolio"
                )
                .textContent =
                "Folio: " +
                folioActual;


            detenerQR();


            setTimeout(
                function() {

                    procesarFolio(
                        folioActual
                    );

                },
                700
            );

        },

        function(errorMessage) {

            // Los errores de lectura
            // son normales mientras busca.
            // No mostramos nada.

        }

    )
    .catch(
        function(error) {

            console.error(
                error
            );


            alert(
                "No se pudo acceder a la cámara. " +
                "Revisa los permisos del navegador."
            );

        }
    );

}


// =====================================================
// DETENER QR
// =====================================================

function detenerQR() {

    if (!lectorQR) {

        return;

    }


    lectorQR
        .stop()
        .then(
            function() {

                lectorQR.clear();

                lectorQR = null;

            }
        )
        .catch(
            function() {

                lectorQR = null;

            }
        );

}


// =====================================================
// PROCESAR FOLIO
// =====================================================

function procesarFolio(
    folio
) {

    if (!folio) {

        alert(
            "Debes ingresar o escanear un folio."
        );

        return;

    }


    folioActual =
        folio
            .trim()
            .toUpperCase();


    // =====================================
    // SALIDA
    // =====================================

    if (
        modoActual ===
        "SALIDA"
    ) {

        registrarSalida();

        return;

    }


    // =====================================
    // ENTRADA
    // =====================================

    if (
        modoActual ===
        "ENTRADA"
    ) {

        buscarFolio();

    }

}


// =====================================================
// BUSCAR FOLIO
// =====================================================

function buscarFolio() {

    mostrarPantalla(
        formularioEntrada
    );


    mensajeEntrada.className =
        "mensaje info";


    mensajeEntrada.textContent =
        "Buscando folio...";


    fetch(

        URL_GOOGLE +
        "?accion=buscar&folio=" +
        encodeURIComponent(
            folioActual
        )

    )

    .then(
        function(response) {

            return response.json();

        }
    )

    .then(
        function(data) {

            console.log(
                "Respuesta búsqueda:",
                data
            );


            // =================================
            // FOLIO ENCONTRADO
            // =================================

            if (
                data.encontrado ===
                true
            ) {

                nombreActual =
                    String(
                        data.nombre || ""
                    )
                    .trim()
                    .toUpperCase();


                mensajeEntrada.className =
                    "mensaje exito";


                mensajeEntrada.textContent =
                    "✓ Folio encontrado";


                setTimeout(
                    function() {

                        mostrarPantalla(
                            pantallaActividades
                        );

                    },
                    400
                );


                return;

            }


            // =================================
            // FOLIO NO ENCONTRADO
            // =================================

            nombreInput.value =
                "";


            mensajeEntrada.className =
                "mensaje info";


            mensajeEntrada.textContent =
                "Folio nuevo. Ingresa el nombre.";


            document
                .getElementById(
                    "campoNombre"
                )
                .classList.remove(
                    "oculto"
                );


            document
                .getElementById(
                    "btnNombre"
                )
                .classList.remove(
                    "oculto"
                );


            setTimeout(
                function() {

                    nombreInput.focus();

                },
                100
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                error
            );


            mensajeEntrada.className =
                "mensaje error";


            mensajeEntrada.textContent =
                "No se pudo conectar con Google Sheets.";

        }
    );

}


// =====================================================
// REGISTRAR NOMBRE DEL FOLIO NUEVO
// =====================================================

document
    .getElementById(
        "btnNombre"
    )
    .addEventListener(
        "click",
        function() {

            const nombre =
                nombreInput.value
                    .trim()
                    .toUpperCase();


            if (!nombre) {

                mensajeEntrada.className =
                    "mensaje error";


                mensajeEntrada.textContent =
                    "Escribe el nombre.";

                return;

            }


            nombreActual =
                nombre;


            guardarNuevoUsuario();

        }
    );


// =====================================================
// GUARDAR USUARIO NUEVO
// =====================================================

function guardarNuevoUsuario() {

    mensajeEntrada.className =
        "mensaje info";


    mensajeEntrada.textContent =
        "Registrando folio...";


    fetch(

        URL_GOOGLE,

        {

            method:
                "POST",

            body:
                JSON.stringify({

                    modo:
                        "REGISTRAR_USUARIO",

                    folio:
                        folioActual
                            .toUpperCase(),

                    nombre:
                        nombreActual
                            .toUpperCase()

                })

        }

    )

    .then(
        function(response) {

            return response.json();

        }
    )

    .then(
        function(data) {

            console.log(
                "Registro usuario:",
                data
            );


            if (data.error) {

                mensajeEntrada.className =
                    "mensaje error";


                mensajeEntrada.textContent =
                    data.error;

                return;

            }


            mostrarPantalla(
                pantallaActividades
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                error
            );


            mensajeEntrada.className =
                "mensaje error";


            mensajeEntrada.textContent =
                "Error al registrar el folio.";

        }
    );

}


// =====================================================
// ACTIVIDADES DIRECTAS
// =====================================================

document
    .querySelectorAll(
        ".actividad[data-actividad]"
    )
    .forEach(
        function(boton) {

            boton.addEventListener(
                "click",
                function() {

                    const actividad =
                        boton.dataset.actividad;


                    registrarEntrada(
                        actividad
                    );

                }
            );

        }
    );


// =====================================================
// PREPA ABIERTA
// =====================================================

document
    .getElementById(
        "btnPrepaAbierta"
    )
    .addEventListener(
        "click",
        function() {

            const opciones =
                crearNumeros(
                    1,
                    21
                );


            crearSubmenu(
                "🎓 Prepa Abierta",
                opciones
            );

        }
    );


// =====================================================
// PREPA EN LÍNEA
// =====================================================

document
    .getElementById(
        "btnPrepaLinea"
    )
    .addEventListener(
        "click",
        function() {

            const opciones = [

                "Propedéutico"

            ];


            for (
                let i = 1;
                i <= 23;
                i++
            ) {

                opciones.push(
                    String(i)
                );

            }


            crearSubmenu(
                "🧑‍🎓 Prepa en Línea",
                opciones
            );

        }
    );


// =====================================================
// ASESORÍAS
// =====================================================

document
    .getElementById(
        "btnAsesoria"
    )
    .addEventListener(
        "click",
        function() {

            crearSubmenu(

                "👨‍🏫 Asesorías",

                [

                    "Matemáticas",

                    "Español",

                    "Historia",

                    "Química",

                    "Biología"

                ]

            );

        }
    );


// =====================================================
// CREAR NÚMEROS
// =====================================================

function crearNumeros(
    inicio,
    fin
) {

    const resultado = [];


    for (
        let i = inicio;
        i <= fin;
        i++
    ) {

        resultado.push(
            String(i)
        );

    }


    return resultado;

}


// =====================================================
// CREAR SUBMENÚ
// =====================================================

function crearSubmenu(
    titulo,
    opciones
) {

    document
        .getElementById(
            "tituloSubmenu"
        )
        .textContent =
        titulo;


    const contenedor =
        document.getElementById(
            "botonesSubmenu"
        );


    contenedor.innerHTML =
        "";


    opciones.forEach(
        function(opcion) {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "boton actividad";


            boton.textContent =
                opcion;


            // =================================
            // AL TOCAR REGISTRA DIRECTAMENTE
            // =================================

            boton.addEventListener(
                "click",
                function() {

                    const actividad =
                        titulo +
                        " - " +
                        opcion;


                    registrarEntrada(
                        actividad
                    );

                }
            );


            contenedor.appendChild(
                boton
            );

        }
    );


    mostrarPantalla(
        pantallaSubmenu
    );

}


// =====================================================
// PANTALLA DE BIENVENIDA
// =====================================================

function mostrarBienvenida(
    tipo,
    actividad
) {

    const titulo =
        document.getElementById(
            "tituloBienvenida"
        );

    const mensaje =
        document.getElementById(
            "mensajeBienvenida"
        );

    const actividadTexto =
        document.getElementById(
            "actividadBienvenida"
        );


    // =====================================
    // ENTRADA
    // =====================================

    if (
        tipo === "ENTRADA"
    ) {

        titulo.textContent =
            "¡BIENVENIDO!";

        mensaje.textContent =
            nombreActual;

        actividadTexto.textContent =
            actividad;

    }


    // =====================================
    // SALIDA
    // =====================================

    if (
        tipo === "SALIDA"
    ) {

        titulo.textContent =
            "¡HASTA PRONTO!";

        mensaje.textContent =
            folioActual;

        actividadTexto.textContent =
            "Salida registrada";

    }


    mostrarPantalla(
        pantallaBienvenida
    );


    // =====================================
    // REGRESAR AL INICIO EN 3 SEGUNDOS
    // =====================================

    setTimeout(
        function() {

            volverInicio();

        },
        3000
    );

}


// =====================================================
// REGISTRAR ENTRADA
// =====================================================

function registrarEntrada(
    actividad
) {

    // Evitar doble clic
    const botones =
        document.querySelectorAll(
            ".actividad"
        );


    botones.forEach(
        function(boton) {

            boton.disabled =
                true;

        }
    );


    fetch(

        URL_GOOGLE,

        {

            method:
                "POST",

            body:
                JSON.stringify({

                    modo:
                        "ENTRADA",

                    folio:
                        folioActual
                            .toUpperCase(),

                    nombre:
                        nombreActual
                            .toUpperCase(),

                    actividad:
                        actividad

                })

        }

    )

    .then(
        function(response) {

            return response.json();

        }
    )

    .then(
        function(data) {

            console.log(
                "Entrada:",
                data
            );


            if (data.error) {

                alert(
                    data.error
                );

                botones.forEach(
                    function(boton) {

                        boton.disabled =
                            false;

                    }
                );

                return;

            }


            // =====================================
            // MOSTRAR BIENVENIDA
            // =====================================

            mostrarBienvenida(
                "ENTRADA",
                actividad
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                error
            );


            alert(
                "No se pudo registrar la entrada."
            );


            botones.forEach(
                function(boton) {

                    boton.disabled =
                        false;

                }
            );

        }
    );

}


// =====================================================
// REGISTRAR SALIDA
// =====================================================

function registrarSalida() {

    fetch(

        URL_GOOGLE,

        {

            method:
                "POST",

            body:
                JSON.stringify({

                    modo:
                        "SALIDA",

                    folio:
                        folioActual
                            .toUpperCase(),

                    nombre:
                        "",

                    actividad:
                        ""

                })

        }

    )

    .then(
        function(response) {

            return response.json();

        }
    )

    .then(
        function(data) {

            console.log(
                "Salida:",
                data
            );


            if (data.error) {

                alert(
                    data.error
                );

                return;

            }


            // =====================================
            // MOSTRAR PANTALLA DE SALIDA
            // =====================================

            mostrarBienvenida(
                "SALIDA",
                ""
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                error
            );


            alert(
                "No se pudo registrar la salida."
            );

        }
    );

}


// =====================================================
// BOTONES CANCELAR
// =====================================================

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
        "btnCancelarManual"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnCancelarQR"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnCancelarEntrada"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnCancelarActividad"
    )
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById(
        "btnVolverActividades"
    )
    .addEventListener(
        "click",
        function() {

            mostrarPantalla(
                pantallaActividades
            );

        }
    );
