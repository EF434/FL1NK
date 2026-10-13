"use strict";

// ---------- SETUP ----------
const canvas = document.getElementById("pirate-game-canvas");
const ctx = canvas.getContext("2d");

const WORLD_WIDTH = 1400;
const WORLD_HEIGHT = 950;

const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 110;
const PLAYER_SPEED = 3;
const LADDER_DISTANCE = 45; // how close you must be to use a ladder

canvas.width = WORLD_WIDTH;
canvas.height = WORLD_HEIGHT;

const playerAnimator = new PlayerAnimator();

let playerDirection = "idle";
let playerMoving = false;

// ---------- SHIP DATA ----------
// For each deck:
// startPoint = left end of the walking line
// endPoint = right end of the walking line
// lineHeight = vertical position of the walking line
const decks = {
    1: { startPoint: 397, endPoint: 993, lineHeight: 861 },
    2: { startPoint: 264, endPoint: 1107, lineHeight: 769 },
    3: { startPoint: 219, endPoint: 1115, lineHeight: 644 },
    4: { startPoint: 201, endPoint: 1127, lineHeight: 517 },
    5: { startPoint: 250, endPoint: 1076, lineHeight: 408 }
};

// ---------- LADDERS ----------
// bottomPoint = lower deck
// topPoint = upper deck
const ladders = [
    { x: 469, bottomPoint: 1, topPoint: 2 },
    { x: 926, bottomPoint: 2, topPoint: 3 },
    { x: 421, bottomPoint: 3, topPoint: 4 },
    { x: 958, bottomPoint: 3, topPoint: 4 },
    { x: 415, bottomPoint: 4, topPoint: 5 },
    { x: 971, bottomPoint: 4, topPoint: 5 }
];

// ---------- PLAYER ----------
let currentDeck = 1;

const player = {
    x: 0,
    y: 0
};

let leftPressed = false;
let rightPressed = false;

// ---------- HTML LIVES SCOREBOARD ----------
function updateLivesDisplay() {
    const heartsContainer = document.getElementById("play-life-hearts");

    if (!heartsContainer) {
        return;
    }

    // Remove heart images until the number of hearts matches remaining lives.
    while (heartsContainer.children.length > lives) {
        heartsContainer.removeChild(heartsContainer.lastElementChild);
    }
}

// ---------- HTML KEY SCOREBOARD ----------
function updateKeyDisplay() {
    const keyImage = document.getElementById("key-status-image");
    const keyText = document.getElementById("key-status-text");
    const tickImage = document.getElementById("key-collected-tick");

    if (!keyImage || !keyText || !tickImage) return;

    if (hasKey) {
        keyImage.alt = "Key collected";
        keyText.textContent = "KEY COLLECTED";
        tickImage.style.display = "block";
    } else {
        keyImage.alt = "Key not collected";
        keyText.textContent = "KEY";
        tickImage.style.display = "none";
    }
}

// ---------- MOVEMENT ----------
function updatePlayer() {
    const deck = decks[currentDeck];

    playerMoving = leftPressed || rightPressed;

    if (leftPressed) {
        playerDirection = "left";
        player.x -= PLAYER_SPEED;
    } else if (rightPressed) {
        playerDirection = "right";
        player.x += PLAYER_SPEED;
    } else {
        playerDirection = "idle";
    }

    // Keep the player inside the current deck.
    player.x = Math.max(
        deck.startPoint,
        Math.min(player.x, deck.endPoint)
    );

    // Keep the player on the deck's walking line.
    player.y = deck.lineHeight;
}

// ---------- LADDERS ----------
// Go up when the player releases the up arrow near a ladder.
function goUp() {
    for (let i = 0; i < ladders.length; i++) {
        const ladder = ladders[i];
        const isClose = Math.abs(player.x - ladder.x) < LADDER_DISTANCE;

        if (isClose && ladder.bottomPoint === currentDeck) {
            currentDeck = ladder.topPoint;
            player.x = ladder.x;
            player.y = decks[currentDeck].lineHeight;
            return;
        }
    }
}

// Go down when the player releases the down arrow near a ladder.
function goDown() {
    for (let i = 0; i < ladders.length; i++) {
        const ladder = ladders[i];
        const isClose = Math.abs(player.x - ladder.x) < LADDER_DISTANCE;

        if (isClose && ladder.topPoint === currentDeck) {
            currentDeck = ladder.bottomPoint;
            player.x = ladder.x;
            player.y = decks[currentDeck].lineHeight;
            return;
        }
    }
}

// ---------- DRAW PLAYER ----------
function drawPlayer() {
    playerAnimator.draw(
        ctx,
        player.x - PLAYER_WIDTH / 2,
        player.y - PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        playerDirection,
        playerMoving
    );
}

// ---------- GAME LOOP ----------
function gameLoop() {
    // Update the game while it is still active.
    if (gameWon === false && gameOver === false) {
        updatePlayer();
        updatePirate();
        collectCoins();
        updateGameItems();

        // Refresh the HTML scoreboards.
        updateLivesDisplay();
        updateKeyDisplay();
    }

    // Draw everything on the canvas.
    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    drawCoins();
    drawGameItems();
    drawPirate();
    drawPlayer();
    drawGameStatus();

    requestAnimationFrame(gameLoop);
}

// ---------- KEYBOARD ----------
// Holding left or right walks.
// Release up or down to use a ladder.
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }

    if (event.key === "ArrowRight") {
        rightPressed = true;
    }

    // Stop arrow keys from scrolling the page.
    if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
    ) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }

    if (event.key === "ArrowRight") {
        rightPressed = false;
    }

    if (event.key === "ArrowUp") {
        goUp();
    }

    if (event.key === "ArrowDown") {
        goDown();
    }
});

// Stop walking if the browser window loses focus.
window.addEventListener("blur", function () {
    leftPressed = false;
    rightPressed = false;
});

// ---------- START ----------
// Start in the middle of deck 1.
player.x = (decks[1].startPoint + decks[1].endPoint) / 2;
player.y = decks[1].lineHeight;

// Display the correct scoreboard states at the start.
updateLivesDisplay();
updateKeyDisplay();

// Position game items on their decks.
positionGameItems();

// Start the game loop.
requestAnimationFrame(gameLoop);
