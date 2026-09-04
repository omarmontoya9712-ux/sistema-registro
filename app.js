const URL_GOOGLE =
"https://script.google.com/macros/s/AKfycby8wUcojpvdzRwuydG2NC1KQBF_WCZggVEDwImcjZyjjUMgWRQFIPKPbrFfg6DLe5cbKQ/exec";


// =====================================================
// VARIABLES
// =====================================================

let modoActual = "";
let folioActual = "";
let nombreActual = "";
let lectorQR = null;

let camaraActual = 0;
let camarasDisponibles = [];

let procesandoRegistro = false;


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
// MAYÚSCULAS
// =====================================================

folioInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value.toUpperCase();

    }
);


nombreInput.addEventListener(
    "input",
    function () {

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
        function (p) {

            p.classList.add("oculto");

        }
    );

    pantalla.classList.remove("oculto");

}


// =====================================================
// VOLVER AL INICIO
// =====================================================

function volverInicio() {

    detenerQR();

    modoActual = "";
    folioActual = "";
    nombreActual = "";

    procesandoRegistro = false;

    folioInput.value = "";
    nombreInput.value = "";

    mensajeEntrada.textContent = "";
    mensajeEntrada.className = "mensaje";

    document
        .getElementById("campoNombre")
        .classList.add("oculto");

    document
        .getElementById("btnNombre")
        .classList.add("oculto");

    document
        .getElementById("qrFolio")
        .textContent = "";

    document
        .getElementById("qrExito")
        .classList.add("oculto");

    document
        .getElementById("reader")
        .innerHTML = "";

    document
        .body
        .classList.remove(
            "confirmacion-entrada",
            "confirmacion-salida",
            "confirmacion-alerta"
        );

    habilitarBotones();

    mostrarPantalla(
        menuPrincipal
    );

}


// =====================================================
// HABILITAR BOTONES
// =====================================================

function habilitarBotones() {

    document
        .querySelectorAll(
            ".boton"
        )
        .forEach(
            function (boton) {

                boton.disabled = false;

            }
        );

}


// =====================================================
// DESHABILITAR BOTONES DE ACTIVIDAD
// =====================================================

function deshabilitarActividades() {

    document
        .querySelectorAll(
            ".actividad"
        )
        .forEach(
            function (boton) {

                boton.disabled = true;

            }
        );

}


// =====================================================
// CONFIRMACIÓN
// =====================================================

function mostrarConfirmacion(
    tipo,
    actividad,
    nombre,
    alertaSalida = false
) {

    const titulo =
        document.getElementById(
            "tituloConfirmacion"
        );

    const mensaje =
        document.getElementById(
            "mensajeConfirmacion"
        );

    const nombreTexto =
        document.getElementById(
            "nombreConfirmacion"
        );

    const actividadTexto =
        document.getElementById(
            "actividadConfirmacion"
        );


    document
        .body
        .classList.remove(
            "confirmacion-entrada",
            "confirmacion-salida",
            "confirmacion-alerta"
        );


    if (
        tipo === "ENTRADA"
    ) {

        titulo.textContent =
            "¡Bienvenido!";

        mensaje.textContent =
            "¡Vuelve pronto!";

        document
            .body
            .classList.add(
                "confirmacion-entrada"
            );

    }

    else if (
        alertaSalida === true
    ) {

        titulo.textContent =
            "¡Atención!";

        mensaje.textContent =
            "No olvides registrar tu entrada";

        actividadTexto.textContent =
            "¡Vuelve pronto!";

        document
            .body
            .classList.add(
                "confirmacion-alerta"
            );

    }

    else {

        titulo.textContent =
            "¡Gracias por tu visita!";

        mensaje.textContent =
            "¡Vuelve pronto!";

        document
            .body
            .classList.add(
                "confirmacion-salida"
            );

    }


    nombreTexto.textContent =
        nombre || "";


    if (
        tipo === "ENTRADA" &&
        actividad
    ) {

        actividadTexto.textContent =
            actividad;

    }

    else if (
        !alertaSalida
    ) {

        actividadTexto.textContent =
            "";

    }


    mostrarPantalla(
        pantallaConfirmacion
    );


    setTimeout(
        function () {

            volverInicio();

        },
        5000
    );

}


// =====================================================
// ENTRADA
// =====================================================

document
    .getElementById("btnEntrada")
    .addEventListener(
        "click",
        function () {

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
        function () {

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
        function () {

            folioInput.value = "";

            mostrarPantalla(
                pantallaManual
            );

            setTimeout(
                function () {

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
        function () {

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
    function (e) {

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
    .getElementById("btnQR")
    .addEventListener(
        "click",
        function () {

            iniciarQR();

        }
    );


// =====================================================
// INICIAR QR
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

        function (decodedText) {

            if (
                procesandoRegistro
            ) {

                return;

            }


            procesandoRegistro =
                true;


            folioActual =
                decodedText
                    .trim()
                    .toUpperCase();


            document
                .getElementById("qrExito")
                .classList.remove("oculto");


            document
                .getElementById("qrFolio")
                .textContent =
                "Folio: " +
                folioActual;


            detenerQR();


            setTimeout(
                function () {

                    procesarFolio(
                        folioActual
                    );

                },
                700
            );

        },

        function () {

            // Búsqueda normal del QR.

        }

    )

    .catch(
        function (error) {

            console.error(
                "Error iniciando cámara:",
                error
            );

            procesandoRegistro = false;

            alert(
                "No se pudo acceder a la cámara. Revisa los permisos del navegador."
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

        function (decodedText) {

            if (
                procesandoRegistro
            ) {

                return;

            }


            procesandoRegistro =
                true;


            folioActual =
                decodedText
                    .trim()
                    .toUpperCase();


            document
                .getElementById("qrExito")
                .classList.remove("oculto");


            document
                .getElementById("qrFolio")
                .textContent =
                "Folio: " +
                folioActual;


            detenerQR();


            setTimeout(
                function () {

                    procesarFolio(
                        folioActual
                    );

                },
                700
            );

        },

        function () {

            // Búsqueda normal.

        }

    )

    .catch(
        function (error) {

            console.error(
                error
            );

            procesandoRegistro = false;

            alert(
                "No se pudo acceder a la cámara. Revisa los permisos del navegador."
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
    .getElementById(
        "btnCambiarCamara"
    )
    .addEventListener(
        "click",
        function () {

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

        procesandoRegistro = false;

        alert(
            "Debes ingresar o escanear un folio."
        );

        return;

    }


    folioActual =
        folio;


    if (
        modoActual === "SALIDA"
    ) {

        buscarNombreParaSalida();

        return;

    }


    if (
        modoActual === "ENTRADA"
    ) {

        buscarFolio();

    }

}


// =====================================================
// BUSCAR FOLIO PARA ENTRADA
// =====================================================

function buscarFolio() {

    mostrarPantalla(
        formularioEntrada
    );


    document
        .getElementById("campoNombre")
        .classList.add("oculto");

    document
        .getElementById("btnNombre")
        .classList.add("oculto");


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
        function (response) {

            return response.json();

        }
    )

    .then(
        function (data) {

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
                    function () {

                        mostrarPantalla(
                            pantallaActividades
                        );

                        procesandoRegistro =
                            false;

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
                .getElementById("campoNombre")
                .classList.remove("oculto");


            document
                .getElementById("btnNombre")
                .classList.remove("oculto");


            setTimeout(
                function () {

                    nombreInput.focus();

                },
                100
            );

            procesandoRegistro =
                false;

        }
    )

    .catch(
        function (error) {

            console.error(
                error
            );

            mensajeEntrada.className =
                "mensaje error";

            mensajeEntrada.textContent =
                "No se pudo conectar con Google Sheets.";

            procesandoRegistro =
                false;

        }
    );

}


// =====================================================
// BUSCAR NOMBRE PARA SALIDA
// =====================================================

function buscarNombreParaSalida() {

    mostrarPantalla(
        formularioEntrada
    );


    document
        .getElementById("campoNombre")
        .classList.add("oculto");

    document
        .getElementById("btnNombre")
        .classList.add("oculto");


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
        function (response) {

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Respuesta salida:",
                data
            );


            if (
                data.encontrado === true
            ) {

                nombreActual =
                    String(
                        data.nombre || ""
                    ).toUpperCase();

            }

            else {

                nombreActual =
                    "";

            }


            registrarSalida();

        }
    )

    .catch(
        function (error) {

            console.error(
                error
            );

            mensajeEntrada.className =
                "mensaje error";

            mensajeEntrada.textContent =
                "No se pudo conectar con Google Sheets.";

            procesandoRegistro =
                false;

        }
    );

}


// =====================================================
// REGISTRAR NOMBRE NUEVO
// =====================================================

document
    .getElementById("btnNombre")
    .addEventListener(
        "click",
        function () {

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


    document
        .getElementById("btnNombre")
        .disabled = true;


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
        function (response) {

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Registro usuario:",
                data
            );


            if (data.error) {

                mensajeEntrada.className =
                    "mensaje error";

                mensajeEntrada.textContent =
                    data.error;

                document
                    .getElementById("btnNombre")
                    .disabled = false;

                return;

            }


            mostrarPantalla(
                pantallaActividades
            );

            procesandoRegistro =
                false;

        }
    )

    .catch(
        function (error) {

            console.error(
                error
            );

            mensajeEntrada.className =
                "mensaje error";

            mensajeEntrada.textContent =
                "Error al registrar el folio.";

            document
                .getElementById("btnNombre")
                .disabled = false;

        }
    );

}


// =====================================================
// ACTIVIDADES DIRECTAS
// =====================================================

document
    .querySelectorAll(
        '.actividad[data-actividad]'
    )
    .forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const actividad =
                        boton.dataset.actividad;


                    registrarEntrada(
                        actividad,
                        ""
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
        function () {

            const opciones =
                crearModulos(
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
        function () {

            const opciones = [
                "Propedéutico"
            ];


            for (
                let i = 1;
                i <= 23;
                i++
            ) {

                opciones.push(
                    "Módulo " + i
                );

            }


            crearSubmenu(
                "🧑‍🎓 Prepa en Línea",
                opciones,
                false
            );

        }
    );


// =====================================================
// BACHILLERATOS PILARES
// =====================================================

document
    .getElementById("btnBachillerato")
    .addEventListener(
        "click",
        function () {

            const opciones =
                crearModulos(
                    13
                );


            crearSubmenu(
                "🎓 Bachilleratos PILARES",
                opciones,
                false
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
        function () {

            crearSubmenu(

                "👩‍🏫 Asesorías Académicas",

                [

                    "📐 Matemáticas",

                    "📖 Español",

                    "🌎 Historia",

                    "⚗️ Química",

                    "🧬 Biología"

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
        function () {

            crearSubmenu(

                "💻 Computación",

                [

                    "💻 Escuela de Código",

                    "👩‍🏫 Profesora Gabi",

                    "👨‍🏫 Profesor Pedro"

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
        function () {

            crearSubmenu(

                "👥 Beneficiarios",

                [

                    "💪 Ponte Pila",

                    "💰 Autonomía Económica",

                    "🎭 Cultura",

                    "🌐 Ciberescuela"

                ],

                false

            );

        }
    );


// =====================================================
// CREAR MÓDULOS
// =====================================================

function crearModulos(
    cantidad
) {

    const resultado = [];


    for (
        let i = 1;
        i <= cantidad;
        i++
    ) {

        resultado.push(
            "Módulo " + i
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
    esModulo
) {

    document
        .getElementById("tituloSubmenu")
        .textContent =
        titulo;


    const instruccion =
        document.getElementById(
            "instruccionSubmenu"
        );


    if (
        esModulo ||
        titulo === "🧑‍🎓 Prepa en Línea" ||
        titulo === "🎓 Bachilleratos PILARES"
    ) {

        instruccion.textContent =
            "Elige tu módulo";

        instruccion.classList.remove(
            "oculto"
        );

    }

    else {

        instruccion.textContent =
            "";

        instruccion.classList.add(
            "oculto"
        );

    }


    const contenedor =
        document.getElementById(
            "botonesSubmenu"
        );


    contenedor.innerHTML = "";


    opciones.forEach(
        function (opcion) {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "boton actividad subactividad";


            const partes =
                separarIcono(
                    opcion
                );


            boton.innerHTML =

                '<span class="actividad-icono">' +
                partes.icono +
                '</span>' +

                '<span class="actividad-texto">' +
                partes.texto +
                '</span>';


            boton.addEventListener(
                "click",
                function () {

                    if (
                        boton.disabled
                    ) {

                        return;

                    }


                    const textoOpcion =
                        partes.texto;


                    let actividad =
                        titulo
                            .replace(
                                /^[^\p{L}\p{N}]+/u,
                                ""
                            )
                            .trim();


                    registrarEntrada(
                        actividad,
                        textoOpcion
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
// SEPARAR ICONO Y TEXTO
// =====================================================

function separarIcono(
    texto
) {

    const resultado =
        texto.match(
            /^(\S+)\s+(.+)$/
        );


    if (
        resultado
    ) {

        return {

            icono:
                resultado[1],

            texto:
                resultado[2]

        };

    }


    return {

        icono:
            "•",

        texto:
            texto

    };

}


// =====================================================
// LIMPIAR ICONOS
// =====================================================

function limpiarActividad(
    actividad
) {

    return actividad
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

    if (
        procesandoRegistro
    ) {

        return;

    }


    procesandoRegistro =
        true;


    actividad =
        limpiarActividad(
            actividad
        );


    opcion =
        opcion
            ? limpiarActividad(
                opcion
            )
            : "";


    deshabilitarActividades();


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
        function (response) {

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Entrada:",
                data
            );


            if (data.error) {

                alert(
                    data.error
                );

                procesandoRegistro =
                    false;

                habilitarBotones();

                return;

            }


            let actividadMostrar =
                actividad;


            if (opcion) {

                actividadMostrar +=
                    " - " +
                    opcion;

            }


            mostrarConfirmacion(

                "ENTRADA",

                actividadMostrar,

                nombreActual,

                false

            );

        }
    )

    .catch(
        function (error) {

            console.error(
                error
            );

            alert(
                "No se pudo registrar la entrada."
            );

            procesandoRegistro =
                false;

            habilitarBotones();

        }
    );

}


// =====================================================
// REGISTRAR SALIDA
// =====================================================

function registrarSalida() {

    if (
        procesandoRegistro
    ) {

        return;

    }


    procesandoRegistro =
        true;


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
                    nombreActual
                        .toUpperCase(),

                actividad:
                    "",

                opcion:
                    ""

            })

        }

    )

    .then(
        function (response) {

            return response.json();

        }
    )

    .then(
        function (data) {

            console.log(
                "Salida:",
                data
            );


            if (data.error) {

                alert(
                    data.error
                );

                procesandoRegistro =
                    false;

                return;

            }


            if (
                data.salidaForzada === true
            ) {

                mostrarConfirmacion(

                    "SALIDA",

                    "",

                    nombreActual,

                    true

                );

                return;

            }


            mostrarConfirmacion(

                "SALIDA",

                "",

                nombreActual,

                false

            );

        }
    )

    .catch(
        function (error) {

            console.error(
                error
            );

            alert(
                "No se pudo registrar la salida."
            );

            procesandoRegistro =
                false;

        }
    );

}


// =====================================================
// BOTONES CANCELAR
// =====================================================

document
    .getElementById("btnCancelarFolio")
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById("btnCancelarManual")
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById("btnCancelarQR")
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById("btnCancelarEntrada")
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById("btnCancelarActividad")
    .addEventListener(
        "click",
        volverInicio
    );


document
    .getElementById("btnVolverActividades")
    .addEventListener(
        "click",
        function () {

            procesandoRegistro =
                false;

            habilitarBotones();

            mostrarPantalla(
                pantallaActividades
            );

        }
    );
