const configuracionElem = document.getElementById('configuracion');
const juegoElem = document.getElementById('juego');
const contadorElem = document.getElementById('tiempo');
const preguntaElem = document.getElementById('pregunta');
const opcionesElem = document.getElementById('opciones');
const resultadoFinalElem = document.getElementById('resultadoFinal');
const puntajeElem = document.getElementById('puntaje');
const mensajeElem = document.getElementById('mensaje');

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
        // Obtener la cantidad de ejercicios asociada al botón
        cantidadEjercicios = parseInt(btn.getAttribute('data-ejercicios'));

        // Marcar el botón seleccionado
        document.querySelectorAll('.ejercicios-btn').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
    });
});

// Evento para los botones de dificultad
document.querySelectorAll('.dificultad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Obtener el tiempo asociado al botón
        tiempoPorPregunta = parseInt(btn.getAttribute('data-tiempo'));

        // Marcar el botón seleccionado
        document.querySelectorAll('.dificultad-btn').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
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

    if (porcentaje >= 80) {
        mensajeElem.textContent = "¡Excelente trabajo!";
    } else if (porcentaje >= 50) {
        mensajeElem.textContent = "¡Bien hecho, sigue practicando!";
    } else {
        mensajeElem.textContent = "No te preocupes, ¡puedes mejorar!";
    }
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
});
