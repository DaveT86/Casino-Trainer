  const normalTables = [5, 8, 11, 17, 35];
        let questions = [];
        let currentQuestionIndex = 0;
        let startTime;
        let currentInput = ""; // Store current input

        function isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints;
        }

        function generateQuestions(tables, rouletteMode = false) {
            const questionsArray = [];
            for (const table of tables) {
                for (let i = 1; i <= 20; i++) {
                    const answer = table * i;
                    if (rouletteMode) {
                        // Roulette Mode
                        let question;
                        switch (table) {
                            case 5:
                                question = `${i} Six-Lines`;
                                break;
                            case 8:
                                question = `${i} Corners`;
                                break;
                            case 11:
                                question = `${i} Streets`;
                                break;
                            case 17:
                                question = `${i} Splits`; 
                                break;
                            case 35:
                                question = `${i} Straight-Ups`; 
                                break;
                        }
                        questionsArray.push({
                            question: question,
                            answer: answer
                        });
                    } else {
                        questionsArray.push({
                            question: `${table} x ${i}`,
                            answer: answer
                        });
                    }
                }
            }
            return questionsArray.sort(() => Math.random() - 0.5); // Shuffle questions
        }

        function startNormalMode() {
            questions = generateQuestions(normalTables);
            startGame();
        }

        function startRouletteMode() {
            questions = generateQuestions(normalTables, true);
            startGame();
        }

        function startGame() {
            currentQuestionIndex = 0;
            startTime = Date.now();
            currentInput = ""; // Reset input
            document.getElementById('inputDisplay').innerText = ""; // Clear display
            document.getElementById('questionContainer').style.display = 'block';
            document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
            askQuestion();
        }

        function askQuestion() {
            if (currentQuestionIndex < questions.length) {
                document.getElementById('question').innerText = questions[currentQuestionIndex].question;
            } else {
                const endTime = Date.now();
                const totalTime = (endTime - startTime) / 1000;
                alert(`You completed all questions in ${totalTime} seconds!`);
                document.getElementById('questionContainer').style.display = 'none';
            }
        }

        function handleInput() {
            const input = parseInt(currentInput);
            const currentQuestion = questions[currentQuestionIndex];

            if (input === currentQuestion.answer) {
                currentQuestionIndex++;
                document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
                askQuestion();
                currentInput = ""; // Reset input after answering
                document.getElementById('inputDisplay').innerText = ""; // Clear display
            }
        }

        function addToInput(num) {
            currentInput += num; // Append number to input
            document.getElementById('inputDisplay').innerText = currentInput; // Update display
            handleInput(); // Check the input after adding
        }

        function clearInput() {
            currentInput = ''; // Clear input
            document.getElementById('inputDisplay').innerText = ''; // Clear display
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

        // Modify input type based on device
        window.onload = function() {
            if (isTouchDevice()) {
                // Hide the input field if it's a touch device
                document.getElementById('answerInput').style.display = 'none';
            } else {
                // Display the input field for keyboard support
                document.getElementById('inputDisplay').style.display = 'block';
            }
        };