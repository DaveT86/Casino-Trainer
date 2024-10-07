let currentQuestion = 0;
let userAnswers = [];
let totalQuestions = 10;
let questionsAsked = new Set();
let startTime;
let endTime;

// Neighbour bets data
const neighbourBets = {
    0: [3, 26, 0, 32, 15],
    1: [16, 33, 1, 20, 14],
    2: [4, 21, 2, 25, 17],
    3: [12, 35, 3, 26, 0],
    4: [15, 19, 4, 21, 2],
    5: [23, 10, 5, 24, 16],
    6: [17, 34, 6, 27, 13],
    7: [18, 29, 7, 28, 12],
    8: [11, 30, 8, 23, 10],
    9: [14, 31, 9, 22, 18],
    10: [8, 23, 10, 5, 24],
    11: [13, 36, 11, 30, 8],
    12: [7, 28, 12, 35, 3],
    13: [6, 27, 13, 36, 11],
    14: [1, 20, 14, 31, 9],
    15: [0, 32, 15, 19, 4],
    16: [5, 24, 16, 33, 1],
    17: [2, 25, 17, 34, 6],
    18: [9, 22, 18, 29, 7],
    19: [32, 15, 19, 4, 21],
    20: [33, 1, 20, 14, 31],
    21: [19, 4, 21, 2, 25],
    22: [31, 9, 22, 18, 29],
    23: [30, 8, 23, 10, 5],
    24: [10, 5, 24, 16, 33],
    25: [21, 2, 25, 17, 34],
    26: [35, 3, 26, 0, 32],
    27: [34, 6, 27, 34, 6],
    28: [29, 7, 28, 12, 35],
    29: [22, 18, 29, 7, 28],
    30: [36, 11, 30, 8, 23],
    31: [20, 14, 31, 9, 22],
    32: [26, 0, 32, 15, 19],
    33: [24, 16, 33, 1, 20],
    34: [25, 17, 34, 6, 27],
    35: [28, 12, 35, 3, 26],
    36: [27, 13, 36, 11, 30],
};

// Function to get the color based on the roulette number
function getRouletteColor(number) {
    if (number === 0) {
        return 'green';
    } else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)) {
        return 'red';
    } else {
        return 'black';
    }
}

function resetGame() {
    // Reset variables
    currentQuestion = 0;
    userAnswers = [];
    correctGuesses = 0;
    questionsAsked.clear(); // Clear the set of questions asked
    startTime = new Date(); // Reset the start time

    // Start the new game
    nextQuestion();
}

function nextQuestion() {
    // If all questions have been asked, display results
    if (questionsAsked.size === totalQuestions) {
        endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        alert(`Quiz completed! Time taken: ${timeTaken} seconds`);
        resetGame(); // Restart the game after the alert
        return;
    }

    // Reset user answers for the new question
    userAnswers = [];
    
    // Get a random question that hasn't been asked yet
    while (true) {
        currentQuestion = Math.floor(Math.random() * Object.keys(neighbourBets).length);
        if (!questionsAsked.has(currentQuestion)) {
            questionsAsked.add(currentQuestion);
            break;
        }
    }

    const correctAnswers = neighbourBets[currentQuestion];
    // Display the correct answers with the roulette colors
    document.getElementById('answerDisplay').innerHTML = correctAnswers.map(answer => 
        `<span style="background-color: ${getRouletteColor(answer)}; color: white; padding: 10px; border-radius: 3px; font-size: 24px;">??</span>`
    ).join(' '); 

    // Update the question text
    const questionElement = document.getElementById('question');
    questionElement.innerHTML = `
        <span style="background-color: ${getRouletteColor(currentQuestion)}; color: white; padding: 10px; border-radius: 3px; font-size: 36px;">
            ${currentQuestion}
        </span>`;
    
    // Update progress
    document.getElementById('progress').innerHTML = `Question ${questionsAsked.size}/${totalQuestions}`;

    // Reset button states
    document.querySelectorAll('.keypad-button').forEach(button => {
        button.style.backgroundColor = '';
        button.disabled = false;
    });
}

function handleButtonClick(button) {
    const number = parseInt(button.innerHTML);
    const correctAnswers = neighbourBets[currentQuestion];

    if (correctAnswers.includes(number)) {
        button.style.backgroundColor = 'green';
        button.disabled = true;
        userAnswers.push(number);

        // Update answer display to show revealed numbers
        document.getElementById('answerDisplay').innerHTML = correctAnswers.map(answer =>
            userAnswers.includes(answer) ? 
            `<span style="background-color: ${getRouletteColor(answer)}; color: white; padding: 10px; border-radius: 3px; font-size: 24px;">${answer}</span>` 
            : 
            `<span style="background-color: ${getRouletteColor(answer)}; color: white; padding: 10px; border-radius: 3px; font-size: 24px;">??</span>`
        ).join(' '); 

        // Check if all correct answers have been guessed
        if (userAnswers.length === correctAnswers.length) {
            setTimeout(nextQuestion, 500);
        }
    } else {
        button.style.backgroundColor = 'red';
        button.disabled = true;

        // Disable all buttons momentarily on incorrect guess
        const keypadButtons = document.querySelectorAll('.keypad-button');
        keypadButtons.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            button.style.backgroundColor = '';
            keypadButtons.forEach(btn => btn.disabled = false);
        }, 1000);
    }
}

// Event listener for buttons
document.querySelectorAll('.keypad-button').forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button));
});

// Start the quiz
startTime = new Date();
nextQuestion();
