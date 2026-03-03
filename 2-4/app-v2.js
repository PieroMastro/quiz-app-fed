let questionDiv = document.querySelector('.question');
let buttons = document.querySelectorAll('.answer-button');

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

        // Calculamos la respuesta correcta
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
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // const j = Math.floor(Math.random() * (i + 1));
            const j = randomInt(0, i); // Utilizando la funcion creada anteriormente

            // Realizamos el intercambio (manual)
            // let temp = array[i];
            // array[i] = array[j];
            // array[j] = temp;

            // Destucturacion de array (mas actual)
            [array[i], array[j]] = [array[j], array[i]] 
        }
    }
}

// 1. Mostrar la primera pregunta (creamos un objeto nuevo)
let currentQuestion = new Question();
currentQuestion.displayQuestion();

// 2. Escuchar los clics de los botones
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // VALIDACION
        if (btn.innerHTML == currentQuestion.correctAnswer) {
            console.log('✅ Correcto!');
        } else {
            console.log('❌ Incorrecto!');
        }

        // ITERACION: Generamos una nueva pregunta
        currentQuestion = new Question();
        currentQuestion.displayQuestion();
    })
});