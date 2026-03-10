// VERSION 3: INCORPORANDO TIEMPO (10seg), CALCULO Y MUESTRA DE ESTADISTICAS

// --- VARIABLES DE ESTADO ---
let score = 0;             // Aciertos
let questionCount = 0;     // Total de intentos
let gameActive = true;     // "Interruptor" del juego
let currentQuestion;

// Elementos del DOM
const questionDiv = document.querySelector('.question');
const buttons = document.querySelectorAll('.answer-button');
const resultDiv = document.querySelector('.result');
const mainContainer = document.querySelector('.main-container');
const startButton = document.querySelector('.start-button');

// ESTADO INICIAL
mainContainer.style.display = 'none';
let highScore = getHighScore(); // Obtenemos el high score al cargar la página
console.log(`High Score al cargar la página: ${highScore}`); // Para verificar que se obtiene correctamente
if  (highScore > 0) {
    resultDiv.innerHTML = `Tu mejor puntuación: <strong>${highScore}</strong> aciertos!`;
}

// MODIFICACION: Agregamos el listener para que el boton de inicio controle el ciclo de la SPA.
// ¿Por qué?: Permite al usuario decidir cuándo comenzar, cumpliendo el paso 1 del flujo.
startButton.addEventListener('click', startGame);

// Funciones de ayuda
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getOperator() {
    const signs = ['+', '-', 'x', '/'];
    return signs[randomInt(0, 3)];
}

class Question {
    constructor() {
        let numberOne = randomInt(1, 30);
        let numberTwo = randomInt(1, 30);
        let operator = getOperator();

        this.questionName = `${numberOne} ${operator} ${numberTwo}`;

        // Logica para calcular la respuesta correcta
        if (operator === '+') { this.correctAnswer = numberOne + numberTwo }
        else if (operator === '-') { this.correctAnswer = numberOne - numberTwo }
        else if (operator === 'x') { this.correctAnswer = numberOne * numberTwo; }
        else if (operator === '/') { this.correctAnswer = Math.round(numberOne / numberTwo); }

        this.answerArray = [
            this.correctAnswer,
            // Modificar segun considere
            randomInt(this.correctAnswer - 10, this.correctAnswer + 10),
            randomInt(this.correctAnswer - 10, this.correctAnswer + 10),
            randomInt(this.correctAnswer + 5, this.correctAnswer + 15),
            randomInt(this.correctAnswer + 1, this.correctAnswer + 15),
        ];

        this.shuffleArray(this.answerArray);
    }

    displayQuestion() {
        questionDiv.innerHTML = this.questionName;
        for (let i = 0; i < this.answerArray.length; i++) {
            buttons[i].innerHTML = this.answerArray[i];
            // Reiniciamos el color del boton (en caso de que se haya modificado por el efecto de clic))
            buttons[i].style.backgroundColor = '#ffca28';
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // const j = Math.floor(Math.random() * (i + 1));
            const j = randomInt(0, i); // generamos un numero entre 0 y i (inclusive)
            // destructuramos el array para intercambiar los elementos
            [array[i], array[j]] = [array[j], array[i]]
        }
    }
}


// --- LÓGICA DEL JUEGO ---

// Evento de clic en botones de respuesta
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // VALIDACION
        if (!gameActive) return; // Si el juego no esta activo, no hacemos nada

        questionCount++; // Incrementamos el contador de preguntas
        // Establecemos una variable booleana para validar la respuesta
        const isCorrect = (btn.innerHTML == currentQuestion.correctAnswer);
        if (isCorrect) {
            console.log('✅ Correcto!');
            score++;
            //Animacion verde (solo si es correcto)
            anime({
                targets: btn,
                backgroundColor: ['#3bdd3b', '#ffca28'],
                duration: 400,
                easing: 'linear'
            });

        } else {
            console.log('❌ Incorrecto!');
            anime({
                targets: btn,
                backgroundColor: ['#ff4d4d', '#ffca28'],
                duration: 400,
                easing: 'linear'
            })
        }

        // ITERACION: Generamos una nueva pregunta, con una pausa corta
        setTimeout(() => {
            if (gameActive) {
                currentQuestion = new Question();
                currentQuestion.displayQuestion();
            }
        }, 300);
    })
});


function startGame() {
    // MODIFICACION: Gestion de UI para iniciar el juego (Paso 2 del flujo).
    // ¿Por qué?: Oculta el titulo y el botón, y muestra el contenedor de juego.
    resultDiv.style.display = 'none';
    startButton.style.display = 'none';
    mainContainer.style.display = 'block';

    // Reiniciamos variables de estado
    score = 0;
    questionCount = 0;
    gameActive = true;

    // MODIFICACION: Se movió la generación de la primera pregunta aquí adentro.
    // ¿Por qué?: Para asegurar que la pregunta se cree justo cuando el usuario hace clic, no al cargar la página.
    currentQuestion = new Question();
    currentQuestion.displayQuestion();

    // MODIFICACION: Se movió el temporizador aquí adentro.
    // ¿Por qué?: El tiempo de 10 segundos debe empezar a correr únicamente cuando el usuario presiona "Iniciar".
    setTimeout(() => {
        gameActive = false; // Desactivamos el juego
        showResults(); // Mostramos resultados
    }, 10000);
};


// 4. Mostrar Resultados Finales
function showResults() {
    // MODIFICACION: Gestion de UI para mostrar estadísticas y reiniciar (Paso 3 del flujo).
    // ¿Por qué?: Oculta el juego, reaparece el botón de inicio y muestra el titulo (ahora con estadísticas).
    mainContainer.style.display = 'none';
    startButton.style.display = 'block';
    resultDiv.style.display = 'block';

    setHighScore(score); // Actualizamos el high score

    let accuracy = questionCount > 0 ? Math.round((score * 100) / questionCount) : 0;
    const currentHigh = getHighScore();

    resultDiv.innerHTML = `
        <div class="final-results">
            <h2>¡Tiempo Agotado! ⏱️</h2>
            <p>Aciertos: <strong>${score}</strong></p>
            <p>Récord Máximo: <strong>${currentHigh}</strong> 🏆</p>
            <p style="color: ${accuracy > 70 ? '#3bdd3b' : '#f57f17'}">
                Precisión: ${accuracy}%
            </p>
        </div>
    `;
};


// #################### PRESERVACION DE SCORE Y ESTADISTICAS ENTRE RONDAS ####################
// Para preservar el score, podemoutilizar cookies, localStorage o sessionStorage, en este caso utilizaremos cookies para guardar el score y el conteo de preguntas, y asi mostrar un historial de resultados al usuario.

// Funciones para manejar cookies
function getHighScore() {
    let cookies = document.cookie.split('; ');
    for (i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split('=');
        if (cookie[0] === 'quizHighScore') {
            return parseInt(cookie[1]); // Retornamos el valor si existe
        }
    }
    return 0; // Si no existe, retornamos 0
}

function setHighScore(newScore) {
    let currentHighScore = getHighScore();

    if (newScore > currentHighScore) {
        const date = new Date(); // Fecha para la expiración de la cookie (30 dias)
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();

        document.cookie = `quizHighScore=${newScore}; ${expires}; path=/`; // Guardamos la nueva puntuación más alta`
    }
    console.log(`High Score actualizado: ${getHighScore()}`); // Para verificar que se actualiza correctamente
};