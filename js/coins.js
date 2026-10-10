
"use strict";

// --------------------------------------------------
// COIN SETTINGS
// --------------------------------------------------

const COIN_SCORE = 10;
const COIN_WIDTH = 32;
const COIN_HEIGHT = 32;

// --------------------------------------------------
// COIN IMAGE
// --------------------------------------------------

const coinImage = new Image();
coinImage.src = "assets/images/coin.png";

// --------------------------------------------------
// COIN POSITIONS
// --------------------------------------------------

// Each coin has an X position, Y position, deck number,
// and collected status.
//
// Coordinates are based on the 1400 x 950 game canvas.
// Adjust them to match the visible surfaces of your ship.

const coins = [
    // DECK 1 - Lower deck
    { x: 350, y: 833, deck: 1, collected: false },
    { x: 450, y: 833, deck: 1, collected: false },
    { x: 600, y: 833, deck: 1, collected: false },
    { x: 750, y: 833, deck: 1, collected: false },
    { x: 900, y: 833, deck: 1, collected: false },

    // DECK 2
    { x: 300, y: 747, deck: 2, collected: false },
    { x: 450, y: 747, deck: 2, collected: false },
    { x: 650, y: 747, deck: 2, collected: false },
    { x: 800, y: 747, deck: 2, collected: false },
    { x: 950, y: 747, deck: 2, collected: false },

    // DECK 3
    { x: 300, y: 619, deck: 3, collected: false },
    { x: 450, y: 619, deck: 3, collected: false },
    { x: 650, y: 619, deck: 3, collected: false },
    { x: 800, y: 619, deck: 3, collected: false },
    { x: 1000, y: 619, deck: 3, collected: false },

    // DECK 4
    { x: 300, y: 506, deck: 4, collected: false },
    { x: 450, y: 506, deck: 4, collected: false },
    { x: 650, y: 506, deck: 4, collected: false },
    { x: 800, y: 506, deck: 4, collected: false },
    { x: 1000, y: 506, deck: 4, collected: false },

    // DECK 5 - Captain's deck
    { x: 400, y: 404, deck: 5, collected: false },
    { x: 550, y: 404, deck: 5, collected: false },
    { x: 750, y: 404, deck: 5, collected: false },
    { x: 900, y: 404, deck: 5, collected: false }
];

// --------------------------------------------------
// PLAYER SCORE
// --------------------------------------------------

let score = 0;
function updateScoreboard() {
    document.getElementById("score-value").textContent = score;
}

// --------------------------------------------------
// DRAW COINS
// --------------------------------------------------

function drawCoins(ctx, currentDeck) {
    coins.forEach(coin => {
        // Skip collected coins and coins on other decks.
        if (coin.collected || coin.deck !== currentDeck) {
            return;
        }

        // Draw the coin image if it has loaded.
        if (
            coinImage.complete &&
            coinImage.naturalWidth > 0
        ) {
            ctx.drawImage(
                coinImage,
                coin.x - COIN_WIDTH / 2,
                coin.y - COIN_HEIGHT / 2,
                COIN_WIDTH,
                COIN_HEIGHT
            );
        }
    });
}

// --------------------------------------------------
// COLLECT COINS
// --------------------------------------------------

function collectCoins(player, currentDeck) {
    coins.forEach(coin => {
        // Only collect coins on the current deck.
        if (coin.collected || coin.deck !== currentDeck) {
            return;
        }

        // Calculate the distance between the player
        // and the coin.
        const distanceX = player.x - coin.x;
        const distanceY = player.y - coin.y;

        const distance = Math.sqrt(
            distanceX * distanceX +
            distanceY * distanceY
        );

        // Collect the coin when the player gets close.
        const collectionDistance =
            Math.max(COIN_WIDTH, COIN_HEIGHT) / 2 + 20;

        if (distance < collectionDistance) {
            coin.collected = true;
            score += COIN_SCORE;
            updateScoreboard();

            console.log(
                "Coin collected! Current score:",
                score
            );
        }
    });
}

// --------------------------------------------------
// DISPLAY SCORE
// --------------------------------------------------

function drawScore(ctx) {
    ctx.save();
    ctx.restore();
}

// --------------------------------------------------
// GET SCORE
// --------------------------------------------------

function getScore() {
    return score;
}

