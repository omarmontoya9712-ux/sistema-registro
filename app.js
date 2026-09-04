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

let camaraActual = 0;

let camarasDisponibles = [];


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

    folioInput.value = "";

    nombreInput.value = "";

    mensajeEntrada.textContent = "";

    document
        .getElementById("qrFolio")
        .textContent = "";

    document
        .getElementById("qrExito")
        .classList.add("oculto");

    mostrarPantalla(
        menuPrincipal
    );

}


// =====================================================
// CONFIRMACIÓN
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


    let textoActividad =
        actividad || "";


    if (opcion) {

        textoActividad +=
            " - " +
            opcion;

    }


    actividadTexto.textContent =
        textoActividad;


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
                .getElementById("tituloFolio")
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
                .getElementById("tituloFolio")
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
// QR CON ID
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
                .getElementById("qrExito")
                .classList.remove("oculto");


            document
                .getElementById("qrFolio")
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

            // Búsqueda normal del QR.

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
// QR CON FACING MODE
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
                .getElementById("qrExito")
                .classList.remove("oculto");


            document
                .getElementById("qrFolio")
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

            // Búsqueda normal del QR.

        }

    )

    .catch(
        function(error) {

            console.error(error);


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


    if (modoActual === "SALIDA") {

        registrarSalida();

        return;

    }


    if (modoActual === "ENTRADA") {

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


            if (data.encontrado === true) {

                nombreActual =
                    String(
                        data.nombre || ""
                    ).toUpperCase();


                mensajeEntrada.className =
                    "mensaje exito";


                mensajeEntrada.textContent =
                    "✓ Folio encontrado";


                document
                    .getElementById("campoNombre")
                    .classList.add("oculto");


                document
                    .getElementById("btnNombre")
                    .classList.add("oculto");


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
                .getElementById("campoNombre")
                .classList.remove("oculto");


            document
                .getElementById("btnNombre")
                .classList.remove("oculto");


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


//
