"use strict";

// ---------- SETTINGS ----------
const COIN_SCORE = 10;
const COIN_SIZE = 32;
const COIN_COLLECT_DISTANCE = 30; // how close the player must be

const coinImage = new Image();
coinImage.src = "assets/images/coin.png";

// ---------- COINS ----------
// x and y are where the coin is drawn on the canvas.
// deck is which deck the coin is on.
const coins = [
    // Deck 1
    { x: 450,  y: 833, deck: 1, collected: false },
    { x: 600,  y: 833, deck: 1, collected: false },
    { x: 750,  y: 833, deck: 1, collected: false },
    { x: 900,  y: 833, deck: 1, collected: false },

    // Deck 2
    { x: 300,  y: 747, deck: 2, collected: false },
    { x: 450,  y: 747, deck: 2, collected: false },
    { x: 650,  y: 747, deck: 2, collected: false },
    { x: 800,  y: 747, deck: 2, collected: false },
    { x: 950,  y: 747, deck: 2, collected: false },

    // Deck 3
    { x: 300,  y: 619, deck: 3, collected: false },
    { x: 450,  y: 619, deck: 3, collected: false },
    { x: 650,  y: 619, deck: 3, collected: false },
    { x: 800,  y: 619, deck: 3, collected: false },
    { x: 1000, y: 619, deck: 3, collected: false },

    // Deck 4
    { x: 300,  y: 506, deck: 4, collected: false },
    { x: 450,  y: 506, deck: 4, collected: false },
    { x: 650,  y: 506, deck: 4, collected: false },
    { x: 800,  y: 506, deck: 4, collected: false },
    { x: 1000, y: 506, deck: 4, collected: false },

    // Deck 5 (captain's deck)
    { x: 400,  y: 404, deck: 5, collected: false },
    { x: 550,  y: 404, deck: 5, collected: false },
    { x: 750,  y: 404, deck: 5, collected: false },
    { x: 900,  y: 404, deck: 5, collected: false }
];

// ---------- SCORE ----------
let score = 0;

function updateScoreboard() {
    document.getElementById("score-value").textContent = score;
}

// ---------- DRAW ----------
// the ship shows every deck at once, so draw all coins not collected yet
function drawCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];

        if (coin.collected === false) {
            ctx.drawImage(
                coinImage,
                coin.x - COIN_SIZE / 2,
                coin.y - COIN_SIZE / 2,
                COIN_SIZE,
                COIN_SIZE
            );
        }
    }
}

// ---------- COLLECT ----------
// a coin is collected when it is on the player's deck
// and the player is close enough left or right
function collectCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];

        if (coin.collected === false && coin.deck === currentDeck) {
            if (Math.abs(player.x - coin.x) < COIN_COLLECT_DISTANCE) {
                coin.collected = true;
                score = score + COIN_SCORE;
                updateScoreboard();
            }
        }
    }
}