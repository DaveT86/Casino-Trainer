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
}

function hasNaturalWin(playerHand, bankerHand) {
    const playerScore = calculateHandValue(playerHand);
    const bankerScore = calculateHandValue(bankerHand);
    return playerScore === 8 || playerScore === 9 || bankerScore === 8 || bankerScore === 9;
}

function isHandComplete() {
    // Hand is complete if either has a natural win or both have 3 cards
    return hasNaturalWin(window.playerHand, window.bankerHand) || 
           (window.playerHand.length === 3 && window.bankerHand.length === 3);
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

        // Check if the Player has drawn their third card
        if (window.playerHand.length === 3) {
            // Check if the Banker can draw after the Player's third card is dealt
            const bankerScore = calculateHandValue(window.bankerHand);
            if (isHandComplete()) {
                document.getElementById('output').innerHTML = '<span class="warning">Hand is complete, Banker cannot draw!</span>';
                document.getElementById('dealBankerCard').disabled = true; // Prevent Banker from drawing
            } else {
                document.getElementById('dealBankerCard').disabled = false; // Banker can still draw if rules allow
            }
        }
    } else {
        document.getElementById('output').innerHTML = '<span class="error">Player cannot draw a card!</span>';
    }
}

function dealBankerCard() {
    const playerScore = calculateHandValue(window.playerHand);
    const bankerScore = calculateHandValue(window.bankerHand);

    // Ensure the Banker can draw before adding a card
    if (canBankerDraw(playerScore, bankerScore)) {
        window.bankerHand.push(window.deck.dealCard());
        displayHands();
        document.getElementById('output').innerHTML = ''; // Clear previous output
    } else {
        document.getElementById('output').innerHTML = '<span class="error">Banker cannot draw a card!</span>';
    }
}

function declareResult(winner) {
    // Check if the hand is complete
    if (!isHandComplete()) {
        document.getElementById('output').innerHTML = '<span class="error">You cannot declare a winner until the hand is complete!</span>';
        return;
    }

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

    // Check for a natural win
    if (hasNaturalWin(window.playerHand, window.bankerHand)) {
        document.getElementById('result').innerHTML = `<span class="result">${winner} wins by natural! (Actual: ${actualWinner})</span>`;
    } else {
        document.getElementById('result').innerHTML = `<span class="result">${winner} wins! (Actual: ${actualWinner})</span>`;
    }

    // Check if the user's declaration is correct
    if (winner !== actualWinner) {
        document.getElementById('result').innerHTML += '<br><span class="error">Try Again</span>';
    } else {
        document.getElementById('result').innerHTML += '<br><span class="result">Correct!</span>';
    }
}

// Event listeners
document.getElementById('dealButton').addEventListener('click', dealPuntoBanco);
document.getElementById('dealPlayerCard').addEventListener('click', dealPlayerCard);
document.getElementById('dealBankerCard').addEventListener('click', dealBankerCard);
document.getElementById('playerWin').addEventListener('click', () => declareResult('Player'));
document.getElementById('bankerWin').addEventListener('click', () => declareResult('Banker'));
document.getElementById('tie').addEventListener('click', () => declareResult('Tie'));
