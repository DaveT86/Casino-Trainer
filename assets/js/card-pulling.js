class Card {
    constructor(value) {
        this.value = value;
    }

    getPoints() {
        return this.value >= 10 ? 0 : this.value; // 10, J, Q, K worth 0 points
    }

    toString() {
        if (this.value === 11) return "J";
        if (this.value === 12) return "Q";
        if (this.value === 13) return "K";
        return this.value; // Return the value for Aces and 2-9
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        for (let i = 1; i <= 13; i++) {
            for (let j = 0; j < 4; j++) { // 4 suits
                this.cards.push(new Card(i));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}

let isBeginnerMode = false; // Track current mode

function calculateHandValue(hand) {
    const totalPoints = hand.reduce((acc, card) => acc + card.getPoints(), 0);
    return totalPoints % 10; // Only the last digit counts
}

function displayHands() {
    const playerCardsDiv = document.getElementById('playerCards');
    const bankerCardsDiv = document.getElementById('bankerCards');

    playerCardsDiv.innerHTML = window.playerHand.map(card => card.toString()).join(', ');
    bankerCardsDiv.innerHTML = window.bankerHand.map(card => card.toString()).join(', ');

    // Disable buttons if either hand has 3 cards
    document.getElementById('dealPlayerCard').disabled = window.playerHand.length >= 3;
    document.getElementById('dealBankerCard').disabled = window.bankerHand.length >= 3;

    // Add class to grey out buttons if they are disabled
    document.getElementById('dealPlayerCard').classList.toggle('disabled', window.playerHand.length >= 3);
    document.getElementById('dealBankerCard').classList.toggle('disabled', window.bankerHand.length >= 3);
}

function dealPuntoBanco() {
    const deck = new Deck();
    window.deck = deck; // Store the deck for later access

    // Clear previous highlights and results
    document.querySelectorAll('.correct').forEach(button => button.classList.remove('correct'));
    document.getElementById('result').innerHTML = ''; // Clear previous results
    document.getElementById('output').innerHTML = ''; // Clear previous output

    // Initial hands
    window.playerHand = [deck.dealCard(), deck.dealCard()];
    window.bankerHand = [deck.dealCard(), deck.dealCard()];

    displayHands();
    document.getElementById('buttons').style.display = 'block'; // Show buttons for further actions

    // Automatically highlight the correct button in Beginner Mode
    if (isBeginnerMode) {
        const playerScore = calculateHandValue(window.playerHand);
        const bankerScore = calculateHandValue(window.bankerHand);
        const actualWinner = playerScore > bankerScore ? 'Player' : bankerScore > playerScore ? 'Banker' : 'Tie';

        // Highlight the correct button based on the scores
        const correctButton = actualWinner === 'Player' ? 'playerWin' : actualWinner === 'Banker' ? 'bankerWin' : 'tie';
        document.getElementById(correctButton).classList.add('correct');

        // Show tooltip for the correct button
        showTooltip(correctButton, `Correct choice: ${actualWinner} wins!`);
    }
}

function showTooltip(buttonId, message) {
    const button = document.getElementById(buttonId);
    const tooltip = document.getElementById('highlight-tooltip');
    tooltip.innerHTML = message;
    tooltip.style.left = button.getBoundingClientRect().left + 'px';
    tooltip.style.top = (button.getBoundingClientRect().top - 30) + 'px'; // Position above the button
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('highlight-tooltip');
    tooltip.style.display = 'none';
}

function canPlayerDraw(playerScore) {
    return playerScore <= 5; // Player draws if score is 5 or less
}

function canBankerDraw(playerScore, bankerScore) {
    if (bankerScore <= 2) return true; // Banker always draws if score is 2 or less
    if (bankerScore === 3 && playerScore !== 8) return true; // Banker draws on 3 unless player has 8
    if (bankerScore === 4 && playerScore >= 2 && playerScore <= 7) return true; // Banker draws on 4 if player is 2-7
    if (bankerScore === 5 && playerScore >= 4 && playerScore <= 7) return true; // Banker draws on 5 if player is 4-7
    if (bankerScore === 6 && (playerScore === 6 || playerScore === 7)) return true; // Banker draws on 6 if player has 6 or 7
    return false; // Banker does not draw otherwise
}

function dealPlayerCard() {
    const playerScore = calculateHandValue(window.playerHand);
    if (canPlayerDraw(playerScore)) {
        window.playerHand.push(window.deck.dealCard());
        displayHands();
        document.getElementById('output').innerHTML = ''; // Clear previous output
    } else {
        document.getElementById('output').innerHTML = '<span class="error">Player cannot draw a card!</span>';
    }
}

function dealBankerCard() {
    const playerScore = calculateHandValue(window.playerHand);
    const bankerScore = calculateHandValue(window.bankerHand);

    if (canBankerDraw(playerScore, bankerScore)) {
        window.bankerHand.push(window.deck.dealCard());
        displayHands();
        document.getElementById('output').innerHTML = ''; // Clear previous output
    } else {
        document.getElementById('output').innerHTML = '<span class="error">Banker cannot draw a card!</span>';
    }
}

function declareResult(winner) {
    const playerScore = calculateHandValue(window.playerHand);
    const bankerScore = calculateHandValue(window.bankerHand);

    let actualWinner;
    if (playerScore > bankerScore) {
        actualWinner = 'Player';
    } else if (bankerScore > playerScore) {
        actualWinner = 'Banker';
    } else {
        actualWinner = 'Tie';
    }

    const naturalWin = (playerScore === 8 || playerScore === 9 || bankerScore === 8 || bankerScore === 9);
    if (naturalWin) {
        document.getElementById('result').innerHTML = `<span class="result">${winner} wins by natural! (Actual: ${actualWinner})</span>`;
    } else {
        document.getElementById('result').innerHTML = `<span class="result">${winner} wins! (Actual: ${actualWinner})</span>`;
    }

    if (winner !== actualWinner) {
        document.getElementById('result').innerHTML += '<br><span class="error">Your declaration was incorrect!</span>';
    } else {
        document.getElementById('result').innerHTML += '<br><span class="result">Your declaration was correct!</span>';
        // Highlight correct button in Beginner Mode
        if (isBeginnerMode) {
            document.getElementById(winner === 'Player' ? 'playerWin' : 'bankerWin').classList.add('correct');
            provideExplanation(winner, playerScore, bankerScore);
        }
    }
}

function provideExplanation(winner, playerScore, bankerScore) {
    let explanation = '';
    if (winner === 'Player') {
        if (playerScore === 8 || playerScore === 9) {
            explanation = `Player wins because they have a natural ${playerScore}.`;
        } else {
            explanation = `Player wins because their score is ${playerScore}, and the banker’s score is ${bankerScore}.`;
        }
    } else if (winner === 'Banker') {
        if (bankerScore === 8 || bankerScore === 9) {
            explanation = `Banker wins because they have a natural ${bankerScore}.`;
        } else {
            explanation = `Banker wins because their score is ${bankerScore}, and the player’s score is ${playerScore}.`;
        }
    } else {
        explanation = `It's a tie! Both player and banker have a score of ${playerScore}.`;
    }

    document.getElementById('output').innerHTML = explanation; // Display explanation in output area
}

// Event listeners
document.getElementById('dealButton').addEventListener('click', dealPuntoBanco);
document.getElementById('dealPlayerCard').addEventListener('click', dealPlayerCard);
document.getElementById('dealBankerCard').addEventListener('click', dealBankerCard);
document.getElementById('playerWin').addEventListener('click', () => declareResult('Player'));
document.getElementById('bankerWin').addEventListener('click', () => declareResult('Banker'));
document.getElementById('tie').addEventListener('click', () => declareResult('Tie'));

// Mode Toggle
document.getElementById('toggleModeButton').addEventListener('click', () => {
    isBeginnerMode = !isBeginnerMode;
    document.getElementById('toggleModeButton').innerText = isBeginnerMode ? 'Switch to Training Mode' : 'Switch to Beginner Mode';
    document.getElementById('result').innerHTML = ''; // Clear results when switching modes
    // Remove highlight from buttons
    document.querySelectorAll('.correct').forEach(button => button.classList.remove('correct'));
});

// Tooltip functionality
const infoButton = document.getElementById('infoButton');
const tooltip = document.getElementById('tooltip');

infoButton.addEventListener('mouseover', () => {
    tooltip.style.display = 'block';
});

infoButton.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
});
