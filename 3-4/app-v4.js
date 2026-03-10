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
const mainContainer = document.querySelector('main');

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

function showResults() {
    mainContainer.style.display = 'none';
}


// --- LÓGICA DEL JUEGO ---

// 1. Iniciar primera pregunta
currentQuestion = new Question();
currentQuestion.displayQuestion();

// 2. Temporizador: Se activa a los 10 segundos
setTimeout(() => {
    gameActive = false; // Desactivamos el juego
    showResults(); // Mostramos resultados
}, 10000);

// 3. Evento de clic en botones
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

// 4. Mostrar Resultados Finales
function showResults() {
    mainContainer.style.display = 'none';

    let accuracy = questionCount > 0 ? Math.round((score * 100) / questionCount) : 0;

    resultDiv.innerHTML = `
        <div class="final-results">
            <h2>¡Tiempo Agotado! ⏱️</h2>
            <p>Aciertos: <strong>${score}</strong></p>
            <p>Intentos totales: ${questionCount}</p>
            <p style="color: ${accuracy > 70 ? '#3bdd3b' : '#f57f17'}">
                Precisión: ${accuracy}%
            </p>
        </div>
    `;
}