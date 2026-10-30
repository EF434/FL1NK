"use strict";

// Importing classes from other files in game.js to run everything
import { Player_Fl1nk } from "./characters_animations.js";
import { Fl1nk_Coins } from "./coins.js";
import { savePlayerScore } from "./player_scores.js";
import {drawLevel1Collisions, checkLevel1Collisions, isLevel1Complete} from "./level1_collisions.js";
import {checkLevel2Collisions, drawLevel2Collisions, isLevel2Complete} from "./level2_collisions.js";
import {Pirate,move_pirate,draw_pirate} from "./pirate.js";
import {drawLevel3Collisions,checkLevel3Collisions,drawMapHint,isLevel3Complete} from "./level3_collisions.js";


// << Defining the levels json files, and the canva id of each level >>>>
const LEVEL_FILES = {"1": "../assets/data/level1.json", "2": "../assets/data/level2.json", "3": "../assets/data/level3.json"};
const LEVEL_CANVAS_IDS = {"1": "fl1nk-game-canvas-level1", "2": "fl1nk-game-canvas-level2", "3": "fl1nk-game-canvas-level3"};


// <<<<<<<<<<<< Get the level that user selected >>>>>>>>
let levelNumber  = "";

// Get each level canavs, and assing it to the varibale
if (document.getElementById(LEVEL_CANVAS_IDS["1"])){
    levelNumber = "1";
} else if (document.getElementById(LEVEL_CANVAS_IDS["2"])){
    levelNumber = "2";
} else if (document.getElementById(LEVEL_CANVAS_IDS["3"])){
    levelNumber = "3";
} else {
    console.log("Unable to load the canvas! There is an error");
}

// Create and setup the canvas
const canvasId = LEVEL_CANVAS_IDS[levelNumber];
const canvas = document.getElementById(canvasId);
const context = canvas.getContext("2d");

// store the keys user clicked and get ids for the game UI
const keysPressed = {};
const scoreElement = document.getElementById("score-value");
const timerElement = document.getElementById("game-timer-text");
const victoryPopup = document.getElementById("game-resut-display");
const victoryScore = document.getElementById("game_score");
const nextLevelButton = document.querySelector(".victory-next-level");
const exitLevelButton = document.querySelector(".victory-exit-level");
const losingPopup = document.getElementById("game-lost-display");
const losingMessage = document.getElementById("losing_display_message");
const replayLevelButton = document.querySelector(".losing-next-level");
const losingExitButton = document.querySelector(".losing-exit-level");

// Defining all the important game variables
let player;
let fl1nk_coin;
let gameInterval;
let timerInterval;
let timeRemaining = 300;
let gameOver = false;



// Adding 'event handlers' so user can control Fl1nk using arrows
window.onkeydown = function(event) {
    if (gameOver === false) {
        keysPressed[event.key] = true;
    }
};

window.onkeyup = function(event) {
    keysPressed[event.key] = false;
};


// Creating two instances of the two deinfed classess to add patroling pirates in level 2
const level3Pirate1 = new Pirate("../assets/images/level3_pirate1.png",300,3,2,1);
const level3Pirate2 = new Pirate("../assets/images/level3_pirate2.png",800,5,3,-1);


// <<<<<<<<<<<< Display the timer on the levels UI >>>>>>>>

// format the time to display the current time 
function updateTimer() {

    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    if (timerElement) {
        timerElement.textContent = minutes + ":" + String(seconds).padStart(2, "0");}
}

// Start the five-minute countdown
function startTimer() {

    updateTimer();
    timerInterval = setInterval(function() {

        // call the timer fucntion, and start reducing the time
        timeRemaining--;
        updateTimer();

        // ending the game when timer reaches 0
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showGameOverPopup("time");
        }

    }, 1000);
}



// Stopping the game and the timer when game is over
function endGame() {

    // checking if the game has already finshed
    if (gameOver === true) {
        return;
    }
    gameOver = true;

    // Stop the game loop
    clearInterval(gameInterval);
}


// <<<<< When player wins the game, end game, and display popup image >>>
function showVictoryPopup() {

    if (gameOver) {
        return;
    }

    // stoping the game
    endGame();

    // sotring the score based on if player was registered or not
    if (sessionStorage.getItem("loggedInUserEmail")) {
        savePlayerScore(levelNumber, fl1nk_coin.score); // saving score

    } else {
        sessionStorage.setItem("fl1nkGuestScore", fl1nk_coin.score);
    }

    if (victoryScore) {
        victoryScore.textContent = fl1nk_coin.score;
    }

    // display the popup and add message in colsole

    victoryPopup.style.display = "flex";
    console.log("Level is compleetd");
}



// Display different popup when the player loses the game
function showGameOverPopup(reason) {

    // checking if game already finished
    if (gameOver === true) {
        return;
    }
    endGame();

    // Display message depending on how the player lost game
    if (reason === "time") {
        losingMessage.innerHTML = "TIME IS UP! <br> Better Luck Next Time!";

    } else if (reason === "hearts") {
        losingMessage.innerHTML = "YOU LOST! <br> Better Luck Next Time!";
    }

    // Display the Game Over popup
    losingPopup.style.display = "flex";
    console.log("Player lost the game");

}

// Move to next level when user clicks the button
if (nextLevelButton) {

    nextLevelButton.onclick = function() {

        // from level 1 to 1
        if (levelNumber === "1") {
            window.location.href = "level2.html";
        // from level 2 to 3
        } else if (levelNumber === "2") {
            window.location.href = "level3.html";
        }
    };
}


// start the level again when user clicks that
if (replayLevelButton) {

    replayLevelButton.onclick = function() {
        window.location.reload();
    };
}

// Exit game when player lost
if (losingExitButton) {

    losingExitButton.onclick = function() {
        window.location = "play_game.html";
    };
}


// <<< Loading the game levels, and it's elements >>> 
function loadLevel() {

    // get the json file of the current level
    const levelFile = LEVEL_FILES[levelNumber];

    // Load the level data
    fetch(levelFile)
        .then(function(response) {
            return response.json();
        })
        .then(function(levelData) {

            // creating the fl1nk character
            player = new Player_Fl1nk(context, levelData);

            // Adding the coins for each level
            fl1nk_coin = new Fl1nk_Coins(context,levelNumber, scoreElement, levelData.decks);

            gameInterval = setInterval(drawFrame, 20);
            startTimer();
        });
}


// Draw the game (main logic)
function drawFrame() {

    // stop if game already ended
    if (gameOver === true) {
        return;
    }

    // clear the previous frame and player position
    context.clearRect(0, 0, canvas.width, canvas.height);
    const previousX = player.xPos;

    // Move FL1NK & collect and draw fl1nk
    player.move(keysPressed);
    fl1nk_coin.collect(player);
    fl1nk_coin.draw();

    // if it's 'level 1', then calling this collision logic
    if (levelNumber === "1") {
        checkLevel1Collisions(player);
        drawLevel1Collisions(context, player.decks);
    }


    // if it's 'level 2', then calling this collision logic
    else if (levelNumber === "2") {

        // draw the collision and patrolling pirate
        move_pirate(player.decks);
        checkLevel2Collisions(player, previousX);

        draw_pirate(context);
        drawLevel2Collisions(context, player.decks);
    }


    // if it's level 3, then calling this collision logic
    else if (levelNumber === "3") {

        // draw patrolling pirates and collisions
        level3Pirate1.move(player.decks);
        level3Pirate2.move(player.decks);

        checkLevel3Collisions(player);
        drawLevel3Collisions(context, player.decks);

        level3Pirate1.draw(context);
        level3Pirate2.draw(context);

        drawMapHint(context);
    }


    // draw fl1nk character
    player.draw();



    // Check if the player has lost all hearts
    const remainingHearts = document.querySelectorAll(".life-heart").length;

    if (remainingHearts === 0) {
        showGameOverPopup("hearts");
        return;
    }

    // Check whether the current level is complete
    if (levelNumber === "1") {

        if (isLevel1Complete()) {
            showVictoryPopup();
            return;
        }

    } else if (levelNumber === "2") {

        if (isLevel2Complete()) {
            showVictoryPopup();
            return;
        }

    } else if (levelNumber === "3") {

        if (isLevel3Complete()) {
            showVictoryPopup();
            return;
        }
    }
}


/// Run the Game /// 
loadLevel();