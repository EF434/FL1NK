
"use strict";

// --------------------------------------------------
// GAME ITEMS: KEY, POISON AND TREASURE
// --------------------------------------------------

const PLAYER_MAX_LIVES = 3;

let lives = PLAYER_MAX_LIVES;
let hasKey = false;
let gameWon = false;
let gameOver = false;

let poisonCooldown = 0;

// Item positions are based on the maze layout.
const gameItems = {
    key: {
        x: 500,
        y: 0,
        deck: 3,
        width: 55,
        height:60,
        collected: false,
        image: new Image()
    },

    poison: {
        x: 555,
        y: 0,
        deck: 3,
        width: 55,
        height: 55,
        image: new Image()
    },

    treasure: {
        x: 1000,
        y: 0,
        deck: 5,
        width: 60,
        height: 54,
        opened: false,
        image: new Image()
    }
};

gameItems.key.image.src = "assets/images/key.png";
gameItems.poison.image.src = "assets/images/poison.png";
gameItems.treasure.image.src =
    "assets/images/treasure-locked.png";

const treasureOpenImage = new Image();
treasureOpenImage.src = "assets/images/treasure-open.png";

// --------------------------------------------------
// POSITION ITEMS ON THEIR DECKS
// --------------------------------------------------

function positionGameItems() {
    for (const item of Object.values(gameItems)) {
        const path = getCurrentWalkingPath(item.deck);

        if (path) {
            item.y = getPathYAtX(item.x, path);
        }
    }
}

// --------------------------------------------------
// COLLISION DETECTION
// --------------------------------------------------

function isTouchingItem(item) {
    if (currentDeck !== item.deck) {
        return false;
    }

    return (
        Math.abs(player.x - item.x) <
            (PLAYER_WIDTH + item.width) / 2 &&
        Math.abs(player.y - item.y) <
            (PLAYER_HEIGHT + item.height) / 2
    );
}

// --------------------------------------------------
// UPDATE ITEM INTERACTIONS
// --------------------------------------------------

function updateGameItems() {
    if (gameWon || gameOver) {
        return;
    }

    if (poisonCooldown > 0) {
        poisonCooldown--;
    }

    // Collect the key.
    if (
        !gameItems.key.collected &&
        isTouchingItem(gameItems.key)
    ) {
        gameItems.key.collected = true;
        hasKey = true;
        console.log("You collected the key!");
    }

    // Poison removes one life per cooldown.
    if (
        isTouchingItem(gameItems.poison) &&
        poisonCooldown === 0
    ) {
        lives--;
        poisonCooldown = 60;

        console.log("Poison! Lives remaining:", lives);

        if (lives <= 0) {
            lives = 0;
            gameOver = true;
        }
    }

    // Unlock the treasure with the key.
    if (
        isTouchingItem(gameItems.treasure) &&
        !gameItems.treasure.opened
    ) {
        if (hasKey) {
            gameItems.treasure.opened = true;
            gameWon = true;

            console.log("You unlocked the treasure!");
        } else {
            console.log("Find the key first!");
        }
    }
}

// --------------------------------------------------
// DRAW ITEMS
// --------------------------------------------------


function drawItem(item, fallback) {
    // Hide the item only if it has been collected.
    if (item.collected || item.opened) {
        return;
    }

    const x = item.x - item.width / 2;
    const y = item.y - item.height / 2;

    if (
        item.image.complete &&
        item.image.naturalWidth > 0
    ) {
        ctx.drawImage(
            item.image,
            x,
            y,
            item.width,
            item.height
        );
    } else {
        ctx.font = `${item.height}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fallback, item.x, item.y);
    }
}



function drawGameItems() {
    drawItem(gameItems.key, "🗝️");
    drawItem(gameItems.poison, "☠️");

    const image = gameItems.treasure.opened
        ? treasureOpenImage
        : gameItems.treasure.image;

    if (image.complete && image.naturalWidth > 0) {
        ctx.drawImage(
            image,
            gameItems.treasure.x -
                gameItems.treasure.width / 2,
            gameItems.treasure.y -
                gameItems.treasure.height / 2,
            gameItems.treasure.width,
            gameItems.treasure.height
        );
    } else {
        ctx.font = "40px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            gameItems.treasure.opened ? "💰" : "🧰",
            gameItems.treasure.x,
            gameItems.treasure.y
        );
    }
}


// --------------------------------------------------
// DRAW LIVES AND GAME STATUS
// --------------------------------------------------

function drawGameStatus() {
    ctx.save();

    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(`Lives: ${"❤️".repeat(lives)}`, 25, 25);

    ctx.fillText(
        `Key: ${hasKey ? "Collected" : "Not collected"}`,
        25,
        55
    );

    if (gameWon || gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 44px sans-serif";

        ctx.fillText(
            gameWon ? "TREASURE UNLOCKED!" : "GAME OVER",
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2
        );

        ctx.font = "24px sans-serif";

        ctx.fillText(
            gameWon
                ? "You found the treasure!"
                : "You ran out of lives!",
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2 + 55
        );
    }

    ctx.restore();
}
