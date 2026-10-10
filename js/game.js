
"use strict";

const canvas = document.getElementById("pirate-game-canvas");
const ctx = canvas.getContext("2d");

const WORLD_WIDTH = 1400;
const WORLD_HEIGHT = 950;

const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 44;
const PLAYER_SPEED = 3;
const STAIRCASE_DISTANCE = 45;
const WALKING_PATH_OFFSET_Y = 12;

canvas.width = WORLD_WIDTH;
canvas.height = WORLD_HEIGHT;

// --------------------------------------------------
// PLAYER SPRITE
// --------------------------------------------------

const playerImage = new Image();
playerImage.src = "assets/images/player.png";

// --------------------------------------------------
// DEFAULT LAYOUT
// --------------------------------------------------

let layout = {
    version: 4,
    decks: 5,
    startDeck: 1,
    captainDeck: 5,
    boundary: [],
    walkableAreas: {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
    },
    walkingPaths: {},
    staircases: [],
    exit: null
};

let layoutLoaded = false;
let currentDeck = 1;

const player = {
    x: 0,
    y: 0
};

// Store the keys currently being pressed.
const keysPressed = new Set();

// --------------------------------------------------
// LOAD JSON LAYOUT
// --------------------------------------------------

async function loadLayout() {
    try {
        const response = await fetch(
            "assets/data/fl1nk-maze-layout.json"
        );

        if (!response.ok) {
            throw new Error("Could not load the layout JSON.");
        }

        const parsed = await response.json();

        if (
            !parsed.walkingPaths ||
            !parsed.staircases ||
            !parsed.walkableAreas
        ) {
            throw new Error(
                "The layout must contain walkingPaths, staircases, " +
                "and walkableAreas."
            );
        }

        layout = parsed;
        currentDeck = layout.startDeck || 1;

        const path = getCurrentWalkingPath();

        if (!path) {
            throw new Error(
                "No walking path was found for Deck " + currentDeck
            );
        }

        // Start in the middle of the starting deck.
        player.x = (path.start.x + path.end.x) / 2;
        player.y = getPathYAtX(player.x, path);

        layoutLoaded = true;

        console.log("FL1NK layout loaded:", layout);
        console.log("Starting on Deck", currentDeck);

        requestAnimationFrame(gameLoop);

    } catch (error) {
        console.error("Layout loading failed:", error);

        alert(
            "Could not load the ship layout. Check that " +
            "assets/data/fl1nk-maze-layout.json exists and " +
            "that you are running the game through a local server."
        );
    }
}

// --------------------------------------------------
// DECK WALKING PATHS
// --------------------------------------------------

function getCurrentWalkingPath(deck = currentDeck) {
    if (!layout.walkingPaths) {
        return null;
    }

    return layout.walkingPaths[String(deck)] || null;
}

// Calculate the player's Y position along a deck.
function getPathYAtX(x, path) {
    if (!path) {
        return player.y;
    }

    const start = path.start;
    const end = path.end;

    const differenceX = end.x - start.x;

    if (Math.abs(differenceX) < 0.001) {
        return start.y + WALKING_PATH_OFFSET_Y;
    }

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);

    const clampedX = Math.max(
        minX,
        Math.min(maxX, x)
    );

    const progress =
        (clampedX - start.x) / differenceX;

    return (
        start.y +
        (end.y - start.y) * progress +
        WALKING_PATH_OFFSET_Y
    );
}

// Keep the player within the current deck's walking path.
function keepPlayerOnPath() {
    const path = getCurrentWalkingPath();

    if (!path) {
        return;
    }

    const minX = Math.min(
        path.start.x,
        path.end.x
    );

    const maxX = Math.max(
        path.start.x,
        path.end.x
    );

    player.x = Math.max(
        minX,
        Math.min(maxX, player.x)
    );

    player.y = getPathYAtX(player.x, path);
}

// --------------------------------------------------
// STAIRCASE ENDPOINT DETECTION
// --------------------------------------------------

function getStaircaseEndpoints(staircase) {
    if (!staircase.start || !staircase.end) {
        return null;
    }

    return [
        staircase.start,
        staircase.end
    ];
}

// Find the staircase endpoint closest to a deck's path.
function getEndpointForDeck(staircase, deck) {
    const endpoints = getStaircaseEndpoints(staircase);
    const path = getCurrentWalkingPath(deck);

    if (!endpoints || !path) {
        return null;
    }

    let closestEndpoint = null;
    let smallestDifference = Infinity;

    for (const endpoint of endpoints) {
        const pathY = getPathYAtX(endpoint.x, path);
        const difference = Math.abs(endpoint.y - pathY);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestEndpoint = endpoint;
        }
    }

    return closestEndpoint;
}

// Find the correct endpoints for the current and destination deck.
function getStaircaseForDeck(staircase, deck) {
    if (
        !Number.isInteger(staircase.fromDeck) ||
        !Number.isInteger(staircase.toDeck) ||
        !staircase.start ||
        !staircase.end
    ) {
        return null;
    }

    let destinationDeck;

    if (deck === staircase.fromDeck) {
        destinationDeck = staircase.toDeck;
    } else if (deck === staircase.toDeck) {
        destinationDeck = staircase.fromDeck;
    } else {
        return null;
    }

    const currentEndpoint = getEndpointForDeck(
        staircase,
        deck
    );

    const destinationEndpoint = getEndpointForDeck(
        staircase,
        destinationDeck
    );

    if (!currentEndpoint || !destinationEndpoint) {
        return null;
    }

    return {
        currentEndpoint,
        destinationEndpoint,
        destinationDeck
    };
}

// --------------------------------------------------
// FIND A NEARBY STAIRCASE
// --------------------------------------------------

function findNearbyStaircase() {
    if (!Array.isArray(layout.staircases)) {
        return null;
    }

    for (const staircase of layout.staircases) {
        const endpoints = getStaircaseForDeck(
            staircase,
            currentDeck
        );

        if (!endpoints) {
            continue;
        }

        const distanceX = Math.abs(
            player.x - endpoints.currentEndpoint.x
        );

        if (distanceX <= STAIRCASE_DISTANCE) {
            return {
                ...endpoints,
                staircase
            };
        }
    }

    return null;
}

// --------------------------------------------------
// CLIMB OR DESCEND STAIRS
// --------------------------------------------------

function tryUseStaircase(direction) {
    if (
        direction !== "up" &&
        direction !== "down"
    ) {
        return false;
    }

    const staircase = findNearbyStaircase();

    if (!staircase) {
        console.log(
            "No staircase nearby. Walk closer to the stairs."
        );

        return false;
    }

    const movingUp =
        staircase.destinationDeck > currentDeck;

    const movingDown =
        staircase.destinationDeck < currentDeck;

    if (direction === "up" && !movingUp) {
        console.log("This staircase does not lead upward.");
        return false;
    }

    if (direction === "down" && !movingDown) {
        console.log("This staircase does not lead downward.");
        return false;
    }

    // Switch to the destination deck.
    currentDeck = staircase.destinationDeck;

    // Place the player at the staircase on the new deck.
    player.x = staircase.destinationEndpoint.x;

    const destinationPath = getCurrentWalkingPath();

    if (destinationPath) {
        player.y = getPathYAtX(
            player.x,
            destinationPath
        );
    }

    keepPlayerOnPath();

    console.log("Now on Deck", currentDeck);

    return true;
}

// --------------------------------------------------
// PLAYER MOVEMENT
// --------------------------------------------------

function updatePlayer() {
    const path = getCurrentWalkingPath();

    if (!path) {
        return;
    }

    if (keysPressed.has("ArrowLeft")) {
        player.x -= PLAYER_SPEED;
    }

    if (keysPressed.has("ArrowRight")) {
        player.x += PLAYER_SPEED;
    }

    keepPlayerOnPath();
}

// --------------------------------------------------
// DRAW PLAYER
// --------------------------------------------------

function drawPlayer() {
    const drawX = player.x - PLAYER_WIDTH / 2;
    const drawY = player.y - PLAYER_HEIGHT / 2;

    if (
        playerImage.complete &&
        playerImage.naturalWidth > 0
    ) {
        ctx.drawImage(
            playerImage,
            drawX,
            drawY,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
        );
    } else {
        ctx.fillStyle = "#e26829";

        ctx.fillRect(
            drawX,
            drawY,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
        );
    }
}

// --------------------------------------------------
// MAIN GAME LOOP
// --------------------------------------------------

function gameLoop() {
    if (!layoutLoaded) {
        return;
    }

    // Update the player's position.
    updatePlayer();

    // Check whether the player collects any coins.
    collectCoins(player, currentDeck);

    // Clear the previous frame.
    ctx.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    // Draw coins belonging to the current deck.
// TEMPORARY TEST: Draw coins from every deck.
    drawCoins(ctx, 1);
    drawCoins(ctx, 2);
    drawCoins(ctx, 3);
    drawCoins(ctx, 4);
    drawCoins(ctx, 5);

    // Draw the player above the coins.
    drawPlayer();

    // Display the current score.
    drawScore(ctx);

    requestAnimationFrame(gameLoop);
}

// --------------------------------------------------
// KEYBOARD CONTROLS
// --------------------------------------------------

document.addEventListener("keydown", event => {
    const allowedKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
    ];

    if (!allowedKeys.includes(event.key)) {
        return;
    }

    event.preventDefault();

    // Prevent repeated staircase transitions while holding a key.
    if (event.repeat) {
        return;
    }

    if (event.key === "ArrowUp") {
        tryUseStaircase("up");
        return;
    }

    if (event.key === "ArrowDown") {
        tryUseStaircase("down");
        return;
    }

    keysPressed.add(event.key);
});

document.addEventListener("keyup", event => {
    keysPressed.delete(event.key);
});

// Stop movement if the browser window loses focus.
window.addEventListener("blur", () => {
    keysPressed.clear();
});

// --------------------------------------------------
// START GAME
// --------------------------------------------------

loadLayout();
