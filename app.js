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

// 0 = frontal
// 1 = trasera
let camaraActual = 0;

let camarasDisponibles = [];


// Actividad y opción seleccionadas
let actividadActual = "";

let opcionActual = "";


// =====================================================
// ELEMENTOS
// =====================================================

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

const pantallaConfirmacion =
    document.getElementById("pantallaConfirmacion");

const folioInput =
    document.getElementById("folio");

const nombreInput =
    document.getElementById("nombre");

const mensajeEntrada =
    document.getElementById("mensajeEntrada");


// =====================================================
// CONVERTIR FOLIO Y NOMBRE A MAYÚSCULAS
// =====================================================

folioInput.addEventListener(
    "input",
    function() {

        this.value =
            this.value.toUpperCase();

    }
);


nombreInput.addEventListener(
    "input",
    function() {

        this.value =
            this.value.toUpperCase();

    }
);


// =====================================================
// MOSTRAR PANTALLA
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

        pantallaConfirmacion

    ];


    pantallas.forEach(
        function(p) {

            if (p) {

                p.classList.add("oculto");

            }

        }
    );


    if (pantalla) {

        pantalla.classList.remove("oculto");

    }

}


// =====================================================
// VOLVER AL INICIO
// =====================================================

function volverInicio() {

    detenerQR();


    modoActual = "";

    folioActual = "";

    nombreActual = "";

    actividadActual = "";

    opcionActual = "";


    folioInput.value = "";

    nombreInput.value = "";


    mensajeEntrada.textContent = "";

    mensajeEntrada.className =
        "mensaje";


    const campoNombre =
        document.getElementById(
            "campoNombre"
        );

    const btnNombre =
        document.getElementById(
            "btnNombre"
        );


    if (campoNombre) {

        campoNombre.classList.add(
            "oculto"
        );

    }


    if (btnNombre) {

        btnNombre.classList.add(
            "oculto"
        );

    }


    const qrFolio =
        document.getElementById(
            "qrFolio"
        );


    const qrExito =
        document.getElementById(
            "qrExito"
        );


    if (qrFolio) {

        qrFolio.textContent = "";

    }


    if (qrExito) {

        qrExito.classList.add(
            "oculto"
        );

    }


    mostrarPantalla(
        menuPrincipal
    );

}


// =====================================================
// MOSTRAR CONFIRMACIÓN
// =====================================================

function mostrarConfirmacion(
    tipo,
    actividad,
    opcion
) {

    const titulo =
        document.getElementById(
            "tituloConfirmacion"
        );

    const mensaje =
        document.getElementById(
            "mensajeConfirmacion"
        );

    const actividadTexto =
        document.getElementById(
            "actividadConfirmacion"
        );


    if (tipo === "ENTRADA") {

        titulo.textContent =
            "¡Bienvenido!";

        mensaje.textContent =
            "¡Vuelve pronto!";

    }

    else {

        titulo.textContent =
            "¡Gracias por tu visita!";

        mensaje.textContent =
            "¡Vuelve pronto!";

    }


    let textoFinal = "";


    if (actividad) {

        textoFinal =
            actividad;

    }


    if (opcion) {

        textoFinal +=
            " - " +
            opcion;

    }


    actividadTexto.textContent =
        textoFinal;


    mostrarPantalla(
        pantallaConfirmacion
    );


    setTimeout(
        function() {

            volverInicio();

        },
        3000
    );

}


// =====================================================
// ENTRADA
// =====================================================

document
    .getElementById("btnEntrada")
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
    .getElementById("btnSalida")
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
    .getElementById("btnManual")
    .addEventListener(
        "click",
        function() {

            folioInput.value = "";


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
    .getElementById("btnContinuarFolio")
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

        if (e.key === "Enter") {

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
    .getElementById("btnQR")
    .addEventListener(
        "click",
        function() {

            iniciarQR();

        }
    );


// =====================================================
// INICIAR CÁMARA QR
// =====================================================

async function iniciarQR() {

    mostrarPantalla(
        pantallaQR
    );


    document
        .getElementById("qrExito")
        .classList.add("oculto");


    document
        .getElementById("qrFolio")
        .textContent = "";


    document
        .getElementById("reader")
        .innerHTML = "";


    try {

        camarasDisponibles =
            await Html5Qrcode.getCameras();


        if (
            !camarasDisponibles ||
            camarasDisponibles.length === 0
        ) {

            iniciarQRConModo(
                "user"
            );

            return;

        }


        let indiceFrontal = 0;


        for (
            let i = 0;
            i < camarasDisponibles.length;
            i++
        ) {

            const nombre =
                (
                    camarasDisponibles[i].label ||
                    ""
                ).toLowerCase();


            if (

                nombre.includes("front") ||

                nombre.includes("frontal") ||

                nombre.includes("user") ||

                nombre.includes("facetime")

            ) {

                indiceFrontal = i;

                break;

            }

        }


        camaraActual =
            indiceFrontal;


        actualizarTextoBotonCamara();


        iniciarQRConCamara(
            camarasDisponibles[
                camaraActual
            ].id
        );

    }

    catch (error) {

        console.error(
            "Error obteniendo cámaras:",
            error
        );


        iniciarQRConModo(
            "user"
        );

    }

}


// =====================================================
// INICIAR QR CON CÁMARA
// =====================================================

function iniciarQRConCamara(
    cameraId
) {

    if (lectorQR) {

        detenerQR();

    }


    lectorQR =
        new Html5Qrcode(
            "reader"
        );


    lectorQR.start(

        cameraId,

        {

            fps: 10,

            qrbox: {

                width: 250,

                height: 250

            }

        },

        function(decodedText) {

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

            // Error normal mientras busca el QR.

        }

    )

    .catch(
        function(error) {

            console.error(
                "Error iniciando cámara:",
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
// INICIAR QR CON FACING MODE
// =====================================================

function iniciarQRConModo(
    modoCamara
) {

    if (lectorQR) {

        detenerQR();

    }


    lectorQR =
        new Html5Qrcode(
            "reader"
        );


    lectorQR.start(

        {
            facingMode:
                modoCamara
        },

        {

            fps: 10,

            qrbox: {

                width: 250,

                height: 250

            }

        },

        function(decodedText) {

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

            // Error normal mientras busca el QR.

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
// CAMBIAR CÁMARA
// =====================================================

async function cambiarCamara() {

    if (
        !camarasDisponibles ||
        camarasDisponibles.length < 2
    ) {

        alert(
            "Este dispositivo no tiene otra cámara disponible."
        );

        return;

    }


    try {

        await detenerQR();


        camaraActual =
            (
                camaraActual + 1
            ) %
            camarasDisponibles.length;


        actualizarTextoBotonCamara();


        document
            .getElementById("reader")
            .innerHTML = "";


        iniciarQRConCamara(

            camarasDisponibles[
                camaraActual
            ].id

        );

    }

    catch (error) {

        console.error(
            "Error cambiando cámara:",
            error
        );

    }

}


// =====================================================
// TEXTO BOTÓN CÁMARA
// =====================================================

function actualizarTextoBotonCamara() {

    const boton =
        document.getElementById(
            "btnCambiarCamara"
        );


    if (!boton) {

        return;

    }


    if (
        camarasDisponibles.length < 2
    ) {

        boton.textContent =
            "🔄 CAMBIAR CÁMARA";

        return;

    }


    const camara =
        camarasDisponibles[
            camaraActual
        ];


    const nombre =
        (
            camara.label ||
            ""
        ).toLowerCase();


    if (

        nombre.includes("front") ||

        nombre.includes("frontal") ||

        nombre.includes("user") ||

        nombre.includes("facetime")

    ) {

        boton.textContent =
            "🔄 CÁMARA TRASERA";

    }

    else {

        boton.textContent =
            "🔄 CÁMARA FRONTAL";

    }

}


// =====================================================
// DETENER QR
// =====================================================

async function detenerQR() {

    if (!lectorQR) {

        return;

    }


    try {

        await lectorQR.stop();

    }

    catch (error) {

        console.warn(
            "No fue posible detener el lector:",
            error
        );

    }


    try {

        lectorQR.clear();

    }

    catch (error) {

        console.warn(
            "No fue posible limpiar el lector:",
            error
        );

    }


    lectorQR = null;

}


// =====================================================
// BOTÓN CAMBIAR CÁMARA
// =====================================================

document
    .getElementById("btnCambiarCamara")
    .addEventListener(
        "click",
        function() {

            cambiarCamara();

        }
    );


// =====================================================
// PROCESAR FOLIO
// =====================================================

function procesarFolio(folio) {

    folio =
        folio
            .trim()
            .toUpperCase();


    if (!folio) {

        alert(
            "Debes ingresar o escanear un folio."
        );

        return;

    }


    folioActual =
        folio;


    if (
        modoActual ===
        "SALIDA"
    ) {

        registrarSalida();

        return;

    }


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


            if (
                data.encontrado === true
            ) {

                nombreActual =
                    String(
                        data.nombre || ""
                    ).toUpperCase();


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


            nombreInput.value = "";


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

            console.error(error);


            mensajeEntrada.className =
                "mensaje error";


            mensajeEntrada.textContent =
                "No se pudo conectar con Google Sheets.";

        }
    );

}


// =====================================================
// REGISTRAR NOMBRE
// =====================================================

document
    .getElementById("btnNombre")
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

            method: "POST",

            body: JSON.stringify({

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

            console.error(error);


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
        "#pantallaActividades .actividad[data-actividad]"
    )
    .forEach(
        function(boton) {

            boton.addEventListener(
                "click",
                function() {

                    const actividad =
                        boton.dataset.actividad;


                    const tieneSubmenu =
                        boton.id ===
                            "btnPrepaAbierta" ||

                        boton.id ===
                            "btnPrepaLinea" ||

                        boton.id ===
                            "btnBachilleratos" ||

                        boton.id ===
                            "btnAsesoria" ||

                        boton.id ===
                            "btnComputacion" ||

                        boton.id ===
                            "btnBeneficiarios";


                    if (tieneSubmenu) {

                        return;

                    }


                    actividadActual =
                        actividad;

                    opcionActual =
                        boton.dataset.opcion || "";


                    registrarEntrada(
                        actividadActual,
                        opcionActual
                    );

                }
            );

        }
    );


// =====================================================
// PREPA ABIERTA
// =====================================================

document
    .getElementById("btnPrepaAbierta")
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
                opciones,
                true
            );

        }
    );


// =====================================================
// PREPA EN LÍNEA
// =====================================================

document
    .getElementById("btnPrepaLinea")
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
                opciones,
                true
            );

        }
    );


// =====================================================
// BACHILLERATOS PILARES
// =====================================================

document
    .getElementById("btnBachilleratos")
    .addEventListener(
        "click",
        function() {

            const opciones =
                crearNumeros(
                    1,
                    13
                );


            crearSubmenu(
                "🏫 Bachilleratos PILARES",
                opciones,
                true
            );

        }
    );


// =====================================================
// ASESORÍAS ACADÉMICAS
// =====================================================

document
    .getElementById("btnAsesoria")
    .addEventListener(
        "click",
        function() {

            crearSubmenu(

                "👨‍🏫 Asesorías académicas",

                [

                    "Matemáticas",

                    "Español",

                    "Historia",

                    "Química",

                    "Biología"

                ],

                false

            );

        }
    );


// =====================================================
// COMPUTACIÓN
// =====================================================

document
    .getElementById("btnComputacion")
    .addEventListener(
        "click",
        function() {

            crearSubmenu(

                "🖥️ Computación",

                [

                    "Escuela de Código",

                    "Profesora Gabi",

                    "Profesor Pedro"

                ],

                false

            );

        }
    );


// =====================================================
// BENEFICIARIOS
// =====================================================

document
    .getElementById("btnBeneficiarios")
    .addEventListener(
        "click",
        function() {

            crearSubmenu(

                "👥 Beneficiarios",

                [

                    "Ponte Pila",

                    "Autonomía Económica",

                    "Cultura",

                    "Ciberescuela"

                ],

                false

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
    opciones,
    sonModulos
) {

    document
        .getElementById(
            "tituloSubmenu"
        )
        .textContent =
        titulo;


    const instruccion =
        document.getElementById(
            "instruccionSubmenu"
        );


    if (sonModulos) {

        instruccion.textContent =
            "Elige tu módulo";

    }

    else {

        instruccion.textContent =
            "Selecciona una opción";

    }


    const contenedor =
        document.getElementById(
            "botonesSubmenu"
        );


    contenedor.innerHTML = "";


    opciones.forEach(
        function(opcion) {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "boton actividad boton-subopcion";


            let icono = "";


            // =========================================
            // ICONOS PARA SUBCATEGORÍAS
            // =========================================

            if (!sonModulos) {

                if (
                    titulo.includes(
                        "Asesorías"
                    )
                ) {

                    if (
                        opcion ===
                        "Matemáticas"
                    ) {

                        icono = "🔢";

                    }

                    else if (
                        opcion ===
                        "Español"
                    ) {

                        icono = "📖";

                    }

                    else if (
                        opcion ===
                        "Historia"
                    ) {

                        icono = "🏛️";

                    }

                    else if (
                        opcion ===
                        "Química"
                    ) {

                        icono = "⚗️";

                    }

                    else if (
                        opcion ===
                        "Biología"
                    ) {

                        icono = "🧬";

                    }

                }


                else if (
                    titulo.includes(
                        "Computación"
                    )
                ) {

                    if (
                        opcion ===
                        "Escuela de Código"
                    ) {

                        icono = "💻";

                    }

                    else if (
                        opcion ===
                        "Profesora Gabi"
                    ) {

                        icono = "👩‍🏫";

                    }

                    else if (
                        opcion ===
                        "Profesor Pedro"
                    ) {

                        icono = "👨‍🏫";

                    }

                }


                else if (
                    titulo.includes(
                        "Beneficiarios"
                    )
                ) {

                    if (
                        opcion ===
                        "Ponte Pila"
                    ) {

                        icono = "💪";

                    }

                    else if (
                        opcion ===
                        "Autonomía Económica"
                    ) {

                        icono = "💰";

                    }

                    else if (
                        opcion ===
                        "Cultura"
                    ) {

                        icono = "🎭";

                    }

                    else if (
                        opcion ===
                        "Ciberescuela"
                    ) {

                        icono = "💻";

                    }

                }

            }


            // =========================================
            // TEXTO DE MÓDULOS
            // =========================================

            if (sonModulos) {

                if (
                    titulo.includes(
                        "Prepa Abierta"
                    ) ||
                    titulo.includes(
                        "Prepa en Línea"
                    ) ||
                    titulo.includes(
                        "Bachilleratos"
                    )
                ) {

                    if (
                        opcion ===
                        "Propedéutico"
                    ) {

                        boton.textContent =
                            "Propedéutico";

                    }

                    else {

                        boton.textContent =
                            "Módulo " +
                            opcion;

                    }

                }

            }

            else {

                boton.innerHTML =

                    '<span class="subopcion-icono">' +
                    icono +
                    '</span>' +

                    '<span>' +
                    opcion +
                    '</span>';

            }


            boton.addEventListener(
                "click",
                function() {

                    actividadActual =
                        obtenerActividadDesdeTitulo(
                            titulo
                        );


                    if (sonModulos) {

                        if (
                            opcion ===
                            "Propedéutico"
                        ) {

                            opcionActual =
                                "Propedéutico";

                        }

                        else {

                            opcionActual =
                                "Módulo " +
                                opcion;

                        }

                    }

                    else {

                        opcionActual =
                            opcion;

                    }


                    registrarEntrada(

                        actividadActual,

                        opcionActual

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
// OBTENER ACTIVIDAD DESDE TÍTULO
// =====================================================

function obtenerActividadDesdeTitulo(
    titulo
) {

    if (
        titulo.includes(
            "Prepa Abierta"
        )
    ) {

        return "Prepa Abierta";

    }


    if (
        titulo.includes(
            "Prepa en Línea"
        )
    ) {

        return "Prepa en Línea";

    }


    if (
        titulo.includes(
            "Bachilleratos PILARES"
        )
    ) {

        return "Bachilleratos PILARES";

    }


    if (
        titulo.includes(
            "Asesorías académicas"
        )
    ) {

        return "Asesorías académicas";

    }


    if (
        titulo.includes(
            "Computación"
        )
    ) {

        return "Computación";

    }


    if (
        titulo.includes(
            "Beneficiarios"
        )
    ) {

        return "Beneficiarios";

    }


    return titulo
        .replace(
            /^[^\p{L}\p{N}]+/u,
            ""
        )
        .trim();

}


// =====================================================
// LIMPIAR ICONOS
// =====================================================

function limpiarActividad(
    actividad
) {

    return String(
        actividad || ""
    )
    .replace(
        /^[^\p{L}\p{N}]+/u,
        ""
    )
    .trim();

}


// =====================================================
// REGISTRAR ENTRADA
// =====================================================

function registrarEntrada(
    actividad,
    opcion
) {

    actividad =
        limpiarActividad(
            actividad
        );


    opcion =
        String(
            opcion || ""
        )
        .trim();


    actividadActual =
        actividad;

    opcionActual =
        opcion;


    const botones =
        document.querySelectorAll(
            ".boton"
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

            method: "POST",

            body: JSON.stringify({

                modo:
                    "ENTRADA",

                folio:
                    folioActual
                        .toUpperCase(),

                nombre:
                    nombreActual
                        .toUpperCase(),

                actividad:
                    actividad,

                opcion:
                    opcion

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


            mostrarConfirmacion(

                "ENTRADA",

                actividad,

                opcion

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

            method: "POST",

            body: JSON.stringify({

                modo:
                    "SALIDA",

                folio:
                    folioActual
                        .toUpperCase(),

                nombre:
                    "",

                actividad:
                    "",

                opcion:
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


            mostrarConfirmacion(

                "SALIDA",

                "",

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


// =====================================================
// OCULTAR CAMPOS DE NUEVO USUARIO AL INICIO
// =====================================================

document
    .getElementById(
        "campoNombre"
    )
    .classList.add(
        "oculto"
    );


document
    .getElementById(
        "btnNombre"
    )
    .classList.add(
        "oculto"
    );
