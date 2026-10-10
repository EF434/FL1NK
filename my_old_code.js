

const canvas = document.getElementById("pirate-game-canvas");
const ctx = canvas.getContext("2d");

const WORLD_WIDTH = 1400;
const WORLD_HEIGHT = 950;

const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 44;
const PLAYER_SPEED = 3;
const STAIRCASE_DISTANCE = 45;
const SHOW_DEBUG = true;

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

// Only left and right are continuous movement keys.
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

        // Start in the middle of the current deck.
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

// Get the path for the current deck.
function getCurrentWalkingPath(deck = currentDeck) {
    if (!layout.walkingPaths) {
        return null;
    }

    return layout.walkingPaths[String(deck)] || null;
}

// Get the Y position of the path at a given X position.
// This supports paths that are slightly slanted.
function getPathYAtX(x, path) {
    if (!path) {
        return player.y;
    }

    const start = path.start;
    const end = path.end;

    const differenceX = end.x - start.x;

    if (Math.abs(differenceX) < 0.001) {
        return start.y + 12;
    }

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);

    const clampedX = Math.max(
        minX,
        Math.min(maxX, x)
    );

    const progress = (clampedX - start.x) / differenceX;

    return start.y + (end.y - start.y) * progress + 12;
}

// Keep the player on the current deck's walking path.
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

    // Restrict movement to the path's start and end.
    player.x = Math.max(
        minX,
        Math.min(maxX, player.x)
    );

    // The player cannot freely move vertically.
    player.y = getPathYAtX(player.x, path);
}

// --------------------------------------------------
// STAIRCASE ENDPOINT DETECTION
// --------------------------------------------------

// Get the two endpoints of a staircase.
function getStaircaseEndpoints(staircase) {
    if (!staircase.start || !staircase.end) {
        return null;
    }

    return [
        staircase.start,
        staircase.end
    ];
}

// Find the endpoint closest to a particular deck's
// walking path. This means the JSON endpoint order
// does not have to be correct.
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

// Get the correct current and destination endpoints
// for moving between two decks.
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

    // Find the endpoint closest to each deck's path.
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

        // The player stays on the horizontal walking path,
        // so check the horizontal distance to the stairs.
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

// Up: move to a higher-numbered deck.
// Down: move to a lower-numbered deck.
//
// The player must be near a staircase and press
// the appropriate key. There is no automatic climbing.
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

    // Change the deck.
    currentDeck = staircase.destinationDeck;

    // Place the player at the staircase's X position
    // and align them with the destination deck's path.
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

    // Move left and right only.
    if (keysPressed.has("ArrowLeft")) {
        player.x -= PLAYER_SPEED;
    }

    if (keysPressed.has("ArrowRight")) {
        player.x += PLAYER_SPEED;
    }

    // Prevent the player from leaving the current deck.
    keepPlayerOnPath();
}

// --------------------------------------------------
// DEBUG DRAWING
// --------------------------------------------------

function drawPolygon(points, fill, stroke) {
    if (!points || points.length < 2) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    if (points.length >= 3) {
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();
    }

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawDebugLayout() {
    if (!SHOW_DEBUG || !layoutLoaded) {
        return;
    }

    // Draw the current deck's mapped walking area.
    const areas =
        layout.walkableAreas[String(currentDeck)] || [];

    areas.forEach(area => {
        drawPolygon(
            area,
            "rgba(35, 210, 90, 0.20)",
            "#23a84d"
        );
    });

    // Draw each walking path as a thin line.
    const path = getCurrentWalkingPath();

    if (path) {
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);

        ctx.strokeStyle = "#ffb000";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Mark both ends of the walking path.
        [path.start, path.end].forEach(point => {
            ctx.beginPath();
            ctx.arc(
                point.x,
                point.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#ffb000";
            ctx.fill();
        });
    }

    // Draw staircase connectors.
    layout.staircases.forEach(staircase => {
        if (!staircase.start || !staircase.end) {
            return;
        }

        ctx.beginPath();
        ctx.moveTo(
            staircase.start.x,
            staircase.start.y
        );
        ctx.lineTo(
            staircase.end.x,
            staircase.end.y
        );

        ctx.strokeStyle = "#0878ff";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();

        [staircase.start, staircase.end].forEach(point => {
            ctx.beginPath();
            ctx.arc(
                point.x,
                point.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#0878ff";
            ctx.fill();
        });
    });

    // Display the current deck and controls.
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Deck " + currentDeck, 25, 40);

    ctx.font = "14px Arial";
    ctx.fillText(
        "Left/Right: Walk | Up: Climb | Down: Descend",
        25,
        65
    );
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
        // Temporary rectangle while the sprite loads.
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

    updatePlayer();

    ctx.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    drawDebugLayout();
    drawPlayer();

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

    // Prevent a held key from triggering repeated
    // staircase transitions.
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
