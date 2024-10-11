const configuracionElem = document.getElementById('configuracion');
const juegoElem = document.getElementById('juego');
const contadorElem = document.getElementById('tiempo');
const preguntaElem = document.getElementById('pregunta');
const opcionesElem = document.getElementById('opciones');
const resultadoFinalElem = document.getElementById('resultadoFinal');
const puntajeElem = document.getElementById('puntaje');
const mensajeElem = document.getElementById('mensaje');
const compartirBtn = document.getElementById('compartirWhatsApp');

const iniciarBtn = document.getElementById('iniciar');
const reiniciarBtn = document.getElementById('reiniciar');

let cantidadEjercicios = 10; // Valor predeterminado
let tiempoPorPregunta = 8; // Segundos
let tiempoRestante;
let intervalo;
let multiplicaciones = [];
let respuestasCorrectas = 0;
let ejercicioActual = 0;

// Evento para los botones de cantidad de ejercicios
document.querySelectorAll('.ejercicios-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        cantidadEjercicios = parseInt(btn.getAttribute('data-ejercicios'));
        document.querySelectorAll('.ejercicios-btn').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
    });
});

// Evento para los botones de dificultad
document.querySelectorAll('.dificultad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        tiempoPorPregunta = parseInt(btn.getAttribute('data-tiempo'));
        document.querySelectorAll('.dificultad-btn').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
        if (tiempoPorPregunta === 2) {
            document.body.classList.add('nivel-einstein');
        } else {
            document.body.classList.remove('nivel-einstein');
        }
    });
});

// Generar multiplicaciones aleatorias
function generarMultiplicaciones() {
    multiplicaciones = [];
    for (let i = 0; i < cantidadEjercicios; i++) {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        multiplicaciones.push({ num1, num2 });
    }
}

// Mostrar la pregunta actual con animaciones
function mostrarPregunta() {
    preguntaElem.classList.remove('salida-derecha', 'entrada-izquierda');
    opcionesElem.classList.remove('salida-derecha', 'entrada-izquierda');
    preguntaElem.classList.add('entrada-izquierda');
    opcionesElem.classList.add('entrada-izquierda');
    const { num1, num2 } = multiplicaciones[ejercicioActual];
    preguntaElem.textContent = `${num1} x ${num2} = ?`;
    const respuestas = generarOpciones(num1 * num2);
    opcionesElem.innerHTML = '';
    respuestas.forEach(opcion => {
        const btn = document.createElement('button');
        btn.classList.add('opcion');
        btn.textContent = opcion;
        btn.onclick = () => verificarRespuesta(opcion, num1 * num2);
        opcionesElem.appendChild(btn);
    });
    iniciarTemporizador();
}

// Generar opciones de respuesta
function generarOpciones(respuestaCorrecta) {
    const opciones = new Set();
    opciones.add(respuestaCorrecta);
    while (opciones.size < 5) {
        const opcion = Math.floor(Math.random() * 81); // Valores entre 0 y 80
        opciones.add(opcion);
    }
    return [...opciones].sort(() => Math.random() - 0.5); // Mezclar opciones
}

// Verificar la respuesta seleccionada
function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    clearInterval(intervalo);
    if (respuestaSeleccionada === respuestaCorrecta) {
        respuestasCorrectas++;
    }
    siguientePregunta();
}

// Pasar a la siguiente pregunta con animaciones
function siguientePregunta() {
    preguntaElem.classList.add('salida-derecha');
    opcionesElem.classList.add('salida-derecha');
    setTimeout(() => {
        ejercicioActual++;
        if (ejercicioActual < cantidadEjercicios) {
            mostrarPregunta();
        } else {
            mostrarResultados();
        }
    }, 500); // Tiempo de la animación (0.5s)
}

// Mostrar los resultados finales
function mostrarResultados() {
    juegoElem.classList.add('oculto');
    resultadoFinalElem.classList.remove('oculto');
    const porcentaje = (respuestasCorrectas / cantidadEjercicios) * 100;
    puntajeElem.textContent = `Tu puntaje es ${respuestasCorrectas} de ${cantidadEjercicios} (${porcentaje}%)`;
    if (porcentaje === 100) {
        mensajeElem.textContent = "¡Excelente trabajo! CRACK";
    } else if (porcentaje <100 & porcentaje>=80) {
        mensajeElem.textContent = "¡Muy Bien +";
    } else if ((porcentaje <80 & porcentaje>=60)){
        mensajeElem.textContent = "BIEN No te preocupes, ¡puedes mejorar!";
    }else if ((porcentaje <60 & porcentaje>=40)){
        mensajeElem.textContent = "Regular Debes esmerarte, ¡puedes mejorar!";
    }else{
        mensajeElem.textContent = "Debes practicar mucho Tranquilo lo vas a lograr!";
    }
    // Mostrar el botón de compartir por WhatsApp
    compartirBtn.classList.remove('oculto');
}

// Iniciar el temporizador
function iniciarTemporizador() {
    clearInterval(intervalo);  // Detener cualquier temporizador anterior
    tiempoRestante = tiempoPorPregunta;  // Reiniciar el tiempo restante
    contadorElem.textContent = tiempoRestante;
    intervalo = setInterval(() => {
        tiempoRestante--;
        contadorElem.textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            siguientePregunta();
        }
    }, 1000);
}

// Iniciar el juego
iniciarBtn.addEventListener('click', () => {
    configuracionElem.classList.add('oculto');
    juegoElem.classList.remove('oculto');
    respuestasCorrectas = 0;
    ejercicioActual = 0;
    generarMultiplicaciones();
    mostrarPregunta();
});

// Reiniciar el juego
reiniciarBtn.addEventListener('click', () => {
    resultadoFinalElem.classList.add('oculto');
    configuracionElem.classList.remove('oculto');
    compartirBtn.classList.add('oculto'); // Ocultar el botón de compartir al reiniciar
});

// Evento para compartir en WhatsApp
compartirBtn.addEventListener('click', () => {
    const puntaje = `Mi puntaje es ${respuestasCorrectas} de ${cantidadEjercicios} (${((respuestasCorrectas / cantidadEjercicios) * 100).toFixed(2)}%) `;
    const nivel = `Hice ${cantidadEjercicios} Ejercicios en Nivel de dificultad: ${obtenerNivelDificultad()}`;
    const puntajeEnLinea = `${mensajeElem.textContent}`;
    const nota = "¡Intenta superar mi puntaje!";
    const enlace = "https://javier-dotcom.github.io/Juego-Tablas-De-Multiplicar/"; // Cambia esto por el enlace real de tu página
    const mensaje = `${puntaje}\n${nivel}\nMi Nota : ${puntajeEnLinea}\n${nota}\nJuega ahora: ${enlace}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
});


// Función para obtener el nivel de dificultad según el tiempo por pregunta
function obtenerNivelDificultad() {
    switch (tiempoPorPregunta) {
        case 6:
            return "Fácil";
        case 5:
            return "Medio";
        case 4:
            return "Difícil";
        case 3:
            return "Experto";
        case 2:
            return "Nivel Einstein";
        default:
            return "Desconocido";
    }
}
