"use strict";

import { Player_Fl1nk } from "./player_fl1nk.js";
import { CoinManager } from "./coins.js";

// Import the player score storage function
import { savePlayerScore } from "./player_scores.js";

import {
    drawLevel1Collisions,
    checkLevel1Collisions,
    isLevel1Complete
} from "./level1_collisions.js";

import {
    checkLevel2Collisions,
    drawLevel2Collisions,
    isLevel2Complete
} from "./level2_collisions.js";

import {
    Pirate,
    move_pirate,
    draw_pirate
} from "./pirate.js";

import {
    drawLevel3Collisions,
    checkLevel3Collisions,
    drawMapHint,
    isLevel3Complete
} from "./level3_collisions.js";


// ============== LEVEL FILES ==============

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


// ============== GET CURRENT LEVEL ==============

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

// Get the timer from the information board
const timerElement = document.getElementById("game-timer-text");


// ============== VICTORY POPUP ELEMENTS ==============

const victoryPopup = document.getElementById("game-resut-display");
const victoryScore = document.getElementById("game_score");

const nextLevelButton = document.querySelector(".victory-next-level");
const exitLevelButton = document.querySelector(".victory-exit-level");


// ============== GAME OVER POPUP ELEMENTS ==============

const losingPopup = document.getElementById("game-lost-display");

const losingMessage = document.getElementById("losing_display_message");

const replayLevelButton = document.querySelector(".losing-next-level");
const losingExitButton = document.querySelector(".losing-exit-level");


// ============== GAME VARIABLES ==============

let player;
let coinManager;

// Timer settings for all three levels
let timeRemaining = 300;

let gameOver = false;

let gameInterval;
let timerInterval;


// ============== LEVEL 3 PIRATES ==============

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


// ============== KEYBOARD CONTROLS ==============

window.addEventListener("keydown", event => {

    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }

    if (!gameOver) {
        keysPressed[event.key] = true;
    }
});

window.addEventListener("keyup", event => {
    keysPressed[event.key] = false;
});

window.addEventListener("blur", () => {

    for (const key of Object.keys(keysPressed)) {
        keysPressed[key] = false;
    }
});


// ============== GAME TIMER ==============

// Display the remaining time on the information board
function updateTimer() {

    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;

    if (timerElement) {
        timerElement.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }
}


// Start the 5-minute countdown
function startTimer() {

    updateTimer();

    timerInterval = window.setInterval(function() {

        if (gameOver) {
            return;
        }

        timeRemaining--;

        updateTimer();

        // Show Game Over when time runs out
        if (timeRemaining <= 0) {
            showGameOverPopup("time");
        }

    }, 1000);
}


// ============== END GAME ==============

// Stop the game and timer
function endGame() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    // Clear any pressed movement keys
    for (const key of Object.keys(keysPressed)) {
        keysPressed[key] = false;
    }
}


// ============== VICTORY POPUP ==============

// Display the Victory popup when FL1NK opens the treasure
function showVictoryPopup() {

    if (gameOver) {
        return;
    }

    // Stop the game
    endGame();

    // ============== SAVE PLAYER SCORE ==============

    // Save the player's best score after completing the level
    savePlayerScore(levelNumber, coinManager.score);

    // Display the player's final score
    if (victoryScore && scoreElement) {
        victoryScore.textContent = scoreElement.textContent;
    }

    // Show the Victory board
    if (victoryPopup) {
        victoryPopup.style.display = "flex";
        victoryPopup.setAttribute("aria-hidden", "false");
    }

    console.log("Level " + levelNumber + " Complete!");
}


// ============== GAME OVER POPUP ==============

// Display the Game Over popup when FL1NK loses
function showGameOverPopup(reason) {

    if (gameOver) {
        return;
    }

    // Stop the game and timer
    endGame();

    // Display a message based on why FL1NK lost
    if (losingMessage) {

        if (reason === "time") {

            losingMessage.innerHTML =
                "TIME IS UP! <br> Better Luck Next Time!";

        } else if (reason === "hearts") {

            losingMessage.innerHTML =
                "YOU LOST! <br> Better Luck Next Time!";

        }
    }

    // Show the Game Over board
    if (losingPopup) {
        losingPopup.style.display = "flex";
        losingPopup.setAttribute("aria-hidden", "false");
    }

    console.log("Level " + levelNumber + " Game Over!");
}


// ============== VICTORY BUTTONS ==============

// Move to the next level
if (nextLevelButton) {

    nextLevelButton.addEventListener("click", function() {

        if (levelNumber === "1") {
            window.location.href = "level2.html";
        }

        if (levelNumber === "2") {
            window.location.href = "level3.html";
        }

    });
}


// Exit the game and return to the level selection page
if (exitLevelButton) {

    exitLevelButton.addEventListener("click", function() {
        window.location.href = "play_game.html";
    });
}


// ============== GAME OVER BUTTONS ==============

// Replay the current level
if (replayLevelButton) {

    replayLevelButton.addEventListener("click", function() {

        // Reload the page to restart the level
        window.location.reload();

    });
}


// Exit the game after losing
if (losingExitButton) {

    losingExitButton.addEventListener("click", function() {
        window.location.href = "play_game.html";
    });
}


// ============== LOAD LEVEL ==============

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
            throw new Error(
                `Level ${levelNumber} must contain decks and ladders.`
            );
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

        // Start the game animation
        gameInterval = window.setInterval(drawFrame, 20);

        // Start the 5-minute timer
        startTimer();

    } catch (error) {
        console.error(`Level ${levelNumber} could not start:`, error);
    }
}


// ============== DRAW GAME ==============

function drawFrame() {

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Save FL1NK's position before moving
    const previousX = player.xPos;

    player.move(keysPressed);

    coinManager.collect(player);
    coinManager.draw();


    // ============== LEVEL 1 ==============

    if (levelNumber === "1") {

        checkLevel1Collisions(player);

        drawLevel1Collisions(context, player.decks);
    }


    // ============== LEVEL 2 ==============

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


    // ============== LEVEL 3 ==============

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

        drawMapHint(context);
    }


    // Draw FL1NK
    player.draw();


    // ============== CHECK GAME RESULT ==============

    // Show Game Over when all three hearts are gone
    const remainingHearts = document.querySelectorAll(".life-heart").length;

    if (remainingHearts === 0) {
        showGameOverPopup("hearts");
        return;
    }

    // Show Victory when Level 1 treasure has been unlocked
    if (levelNumber === "1" && isLevel1Complete()) {
        showVictoryPopup();
        return;
    }

    // Show Victory when Level 2 treasure has been unlocked
    if (levelNumber === "2" && isLevel2Complete()) {
        showVictoryPopup();
        return;
    }

    // Show Victory when Level 3 real treasure has been found
    if (levelNumber === "3" && isLevel3Complete()) {
        showVictoryPopup();
        return;
    }
}


// ============== START GAME ==============

loadLevel();