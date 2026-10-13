
"use strict";

// ---------- GAME STATE ----------
const TOUCH_DISTANCE = 40; // how close counts as touching an item

let lives = 3;
let hasKey = false;
let gameWon = false;
let gameOver = false;
let poisonCooldown = 0; // frames to wait before poison can hurt again

// ---------- ITEMS ----------
// y is set by positionGameItems() so each item sits on its deck
const keyItem = {
    x: 500,
    y: 0,
    deck: 3,
    width: 55,
    height: 60,
    collected: false,
    image: new Image()
};

const poisonItem = {
    x: 555,
    y: 0,
    deck: 3,
    width: 55,
    height: 55,
    image: new Image()
};

const treasureItem = {
    x: 1000,
    y: 0,
    deck: 5,
    width: 60,
    height: 54,
    image: new Image()
};

keyItem.image.src = "assets/images/key.png";
poisonItem.image.src = "assets/images/poison.png";
treasureItem.image.src = "assets/images/treasure-locked.png";

// ---------- POSITION ITEMS ----------
function positionGameItems() {
    keyItem.y = decks[keyItem.deck].lineHeight;
    poisonItem.y = decks[poisonItem.deck].lineHeight;
    treasureItem.y = decks[treasureItem.deck].lineHeight;
}

// ---------- TOUCHING ----------
// Check that the player is on the same deck and close enough to an item.
function isTouching(item) {
    if (currentDeck !== item.deck) {
        return false;
    }

    return Math.abs(player.x - item.x) < TOUCH_DISTANCE;
}

// ---------- UPDATE GAME ITEMS ----------
function updateGameItems() {
    // Reduce the poison cooldown each frame.
    if (poisonCooldown > 0) {
        poisonCooldown = poisonCooldown - 1;
    }

    // Pick up the key.
    if (keyItem.collected === false && isTouching(keyItem)) {
        keyItem.collected = true;
        hasKey = true;
    }

    // Poison removes one life, then waits before it can hurt again.
    if (isTouching(poisonItem) && poisonCooldown === 0 && gameOver === false) {
        lives = lives - 1;
        poisonCooldown = 60;

        // End the game when all lives are lost.
        if (lives <= 0) {
            lives = 0;
            gameOver = true;
        }
    }

    // Open the treasure if the player has collected the key.
    if (hasKey && gameWon === false && isTouching(treasureItem)) {
        gameWon = true;
        treasureItem.image.src = "assets/images/treasure-open.png";
    }
}

// ---------- DRAW ITEMS ----------
function drawItem(item) {
    ctx.drawImage(
        item.image,
        item.x - item.width / 2,
        item.y - item.height / 2,
        item.width,
        item.height
    );
}

function drawGameItems() {
    // The key disappears after it is collected.
    if (keyItem.collected === false) {
        drawItem(keyItem);
    }

    drawItem(poisonItem);
    drawItem(treasureItem);
}

// ---------- GAME HUD ----------
// Lives are displayed using HTML heart images, not canvas emojis.
// Keep the key status on the canvas.


// ---------- GAME OVER SCREEN ----------
function drawEndScreen() {
    let title = "GAME OVER";
    let message = "You ran out of lives!";

    if (gameWon) {
        title = "TREASURE UNLOCKED!";
        message = "You found the treasure!";
    }

    // Dark overlay.
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // End-screen title and message.
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 44px sans-serif";
    ctx.fillText(title, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

    ctx.font = "24px sans-serif";
    ctx.fillText(message, WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 55);
}

// ---------- GAME STATUS ----------
// Called from the game loop.
function drawGameStatus() {
    drawHUD();

    if (gameWon || gameOver) {
        drawEndScreen();
    }
}
