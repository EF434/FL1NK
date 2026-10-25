
"use strict";

import { Player_Fl1nk } from "./player_fl1nk.js";
import { CoinManager } from "./coins.js";
import {drawLevel1Collisions, checkLevel1Collisions} from "./level1_collisions.js";
import { checkLevel2Collisions, drawLevel2Collisions } from "./level2_collisions.js";
import { Pirate, move_pirate, draw_pirate } from "./pirate.js";
import { checkLevel3Collisions,drawLevel3Collisions } from "./level3_collisions.js";

const LEVEL_FILES = {
    "1": "assets/data/level1.json",
    "2": "assets/data/level2.json",
    "3": "assets/data/level3.json"
};

const LEVEL_CANVAS_IDS = {
    "1": "fl1nk-game-canvas-level1",
    "2": "fl1nk-game-canvas-level2",
    "3": "fl1nk-game-canvas-level3"
};

const levelEntry = Object.entries(LEVEL_CANVAS_IDS).find(([, canvasId]) =>
    document.getElementById(canvasId)
);

if (!levelEntry) {
    throw new Error("Could not find a canvas for Level 1, 2, or 3.");
}

const [levelNumber, canvasId] = levelEntry;
const canvas = document.getElementById(canvasId);
const context = canvas.getContext("2d");
const keysPressed = Object.create(null);
const scoreElement = document.getElementById("score-value");

let player;
let coinManager;

// Create two patrolling pirates for Level 3
const level3Pirate1 = new Pirate(
    "assets/images/level3_pirate1.png",
    300,
    3,
    2,
    1
);

const level3Pirate2 = new Pirate(
    "assets/images/level3_pirate2.png",
    800,
    5,
    3,
    -1
);

window.addEventListener("keydown", event => {
    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }

    keysPressed[event.key] = true;
});

window.addEventListener("keyup", event => {
    keysPressed[event.key] = false;
});

window.addEventListener("blur", () => {
    for (const key of Object.keys(keysPressed)) {
        keysPressed[key] = false;
    }
});

async function loadLevel() {
    const levelFile = LEVEL_FILES[levelNumber];

    try {
        const response = await fetch(levelFile);

        if (!response.ok) {
            throw new Error(
                `Could not load level data (${response.status}): ${levelFile}`
            );
        }

        const levelData = await response.json();

        if (!levelData.decks || !Array.isArray(levelData.ladders)) {
            throw new Error(`Level ${levelNumber} must contain decks and ladders.`);
        }

        player = new Player_Fl1nk(
            context,
            levelData,
            levelData.spawn ?? {}
        );

        coinManager = new CoinManager(
            context,
            levelNumber,
            scoreElement,
            levelData.decks
        );

        window.setInterval(drawFrame, 20);
    } catch (error) {
        console.error(`Level ${levelNumber} could not start:`, error);
    }
}

function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Save FL1NK's position before moving
    const previousX = player.xPos;

    player.move(keysPressed);

    coinManager.collect(player);
    coinManager.draw();

    if (levelNumber === "1") {
        checkLevel1Collisions(player);
        drawLevel1Collisions(context, player.decks);
    }

    if (levelNumber === "2") {

        // Move the pirate on Deck 3
        move_pirate(player.decks);

        // Check collisions with obstacles and pirate
        checkLevel2Collisions(player, previousX);

        // Draw the pirate
        draw_pirate(context);

        // Draw Level 2 key and treasure
        drawLevel2Collisions(context, player.decks);
    }

    if (levelNumber === "3") {

        // Move both Level 3 patrolling pirates
        level3Pirate1.move(player.decks);
        level3Pirate2.move(player.decks);

        // Check poison bottle collisions
        checkLevel3Collisions(player);

        // Draw poison bottles on the decks
        drawLevel3Collisions(context, player.decks);

        // Draw both Level 3 pirates
        level3Pirate1.draw(context);
        level3Pirate2.draw(context);
    }

    player.draw();
}

loadLevel();
