let currentIndex = 0;
const sequence = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
let previousNumbers = [];
let startTime; // Variable to track the start time of the challenge

// Initialize the previous numbers array with the last 5 numbers in the sequence
for (let i = sequence.length - 5; i < sequence.length; i++) {
    previousNumbers.push(sequence[i]);
}

// Initialize the app
function startMode() {
    currentIndex = 0;
    previousNumbers = [21, 4, 19, 15, 32]; // Last 5 numbers to display on start
    updatePreviousNumbers();
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('question').textContent = "Input the next number:";
    document.getElementById('inputDisplay').textContent = '';
    document.getElementById('progress').textContent = 'Progress: 0%';
    startTime = Date.now(); // Record the start time
}

// Function to handle keyboard input
function handleKeyInput(event) {
    const key = event.key;

    // Only allow numbers 0-9
    if (key >= '0' && key <= '9') {
        addToInput(parseInt(key));
    }
}

// Function to add input
function addToInput(num) {
    document.getElementById('inputDisplay').textContent += num;
    checkInput();
}

// Function to check user input against the current number in the sequence
function checkInput() {
    const userInput = parseInt(document.getElementById('inputDisplay').textContent);

    // Determine the current number
    const currentNumber = sequence[currentIndex];

    if (userInput === currentNumber) {
        // Update previous numbers
        previousNumbers.push(currentNumber);
        if (previousNumbers.length > 5) previousNumbers.shift(); // Keep only last 5 numbers
        updatePreviousNumbers();

        // Move to the next number in the sequence
        currentIndex = (currentIndex + 1) % sequence.length;

        // Update question prompt
        document.getElementById('question').textContent = "Input the next number:";
        document.getElementById('inputDisplay').textContent = ''; // Clear input display

        // Update progress
        const progressPercentage = ((currentIndex / sequence.length) * 100).toFixed(2);
        document.getElementById('progress').textContent = `Progress: ${progressPercentage}%`;

        // Check if the challenge is complete
        if (currentIndex === 0) {
            endChallenge();
        }
    }
}

// Function to update the display of the previous numbers
function updatePreviousNumbers() {
    const previousNumbersContainer = document.getElementById('previousNumbers');
    previousNumbersContainer.innerHTML = ''; // Clear existing content

    previousNumbers.forEach(num => {
        // Create a span element for each number
        const numberElement = document.createElement('span');
        numberElement.textContent = num;

        // Set the background color based on the roulette number
        numberElement.style.backgroundColor = getNumberColor(num);
        numberElement.style.color = 'white'; // Set text color for contrast
        numberElement.style.padding = '10px'; // Add some padding
        numberElement.style.margin = '2px'; // Add margin between numbers
        numberElement.style.borderRadius = '5px'; // Optional: round the corners
        numberElement.style.fontSize = '24px'; // Make text larger
        numberElement.style.display = 'inline-block'; // Keep them inline

        previousNumbersContainer.appendChild(numberElement); // Append to the container
    });
}

// Function to get the color based on the roulette number
function getNumberColor(num) {
    if (num === 0) {
        return 'green';
    } else if (num % 2 === 0) {
        return (num >= 1 && num <= 10) || (num >= 19 && num <= 28) ? 'black' : 'red';
    } else {
        return (num >= 1 && num <= 10) || (num >= 19 && num <= 28) ? 'red' : 'black';
    }
}

// Function to clear input display
function clearInput() {
    document.getElementById('inputDisplay').textContent = '';
}

// Function to end the challenge and show the time taken
function endChallenge() {
    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Calculate time in seconds
    alert(`Challenge completed! Time taken: ${timeTaken} seconds`);
    document.getElementById('questionContainer').style.display = 'none'; // Hide question container
}

// Keyboard event listener
document.addEventListener('keydown', function(event) {
    const key = event.key;
    // Allow only number keys and backspace
    if (/^[0-9]$/.test(key)) {
        addToInput(key); // Add number from keyboard
    } else if (key === 'Backspace') {
        clearInput(); // Clear input on backspace
    }
});

// Toggle Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
