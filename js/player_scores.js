"use strict";

// ============== FL1NK PLAYER SCORES ==============

// Save the player's score after completing a level
export function savePlayerScore(levelNumber, currentScore) {

    // Get the logged-in player's email
    let playerEmail = sessionStorage.getItem("loggedInUserEmail");

    // Check if the player is logged in
    if (!playerEmail) {
        console.log("Player is not logged in. Score not saved.");
        return;
    }

    // Get the player's registered account
    let savedPlayer = localStorage.getItem(playerEmail);

    if (!savedPlayer) {
        console.log("Player account not found.");
        return;
    }

    // Convert saved JSON into a JavaScript object
    let player = JSON.parse(savedPlayer);

    // Create level scores if the player has no previous scores
    if (!player.levelScores) {
        player.levelScores = {
            1: 0,
            2: 0,
            3: 0
        };
    }

    // Create completed levels list if it does not exist
    if (!player.completedLevels) {
        player.completedLevels = [];
    }

    // Convert level and score into numbers
    let level = Number(levelNumber);
    let score = Number(currentScore);

    // Check that the level and score are valid
    if (![1, 2, 3].includes(level) ||
        !Number.isFinite(score) ||
        score < 0) {

        console.log("Invalid level or score.");
        return;
    }

    // Get the player's previous best score for this level
    let previousScore = Number(player.levelScores[level] || 0);

    // Save only the highest score achieved
    if (score > previousScore) {
        player.levelScores[level] = score;
    }

    // Record the completed level
    if (!player.completedLevels.includes(level)) {
        player.completedLevels.push(level);
        player.completedLevels.sort(function(a, b) {
            return a - b;
        });
    }

    // Calculate the total best score across all three levels
    player.totalScore =
        Number(player.levelScores[1] || 0) +
        Number(player.levelScores[2] || 0) +
        Number(player.levelScores[3] || 0);

    // Save updated player information in localStorage
    localStorage.setItem(playerEmail, JSON.stringify(player));

    console.log("Player score saved successfully!");
    console.log("Total Score:", player.totalScore);
}


// Get the logged-in player's saved scores
export function getPlayerScores() {

    let playerEmail = sessionStorage.getItem("loggedInUserEmail");

    if (!playerEmail) {
        return null;
    }

    let savedPlayer = localStorage.getItem(playerEmail);

    if (!savedPlayer) {
        return null;
    }

    // Convert saved player data into a JavaScript object
    let player = JSON.parse(savedPlayer);

    return {
        username: player.username,
        levelScores: player.levelScores || {
            1: 0,
            2: 0,
            3: 0
        },
        totalScore: player.totalScore || 0,
        completedLevels: player.completedLevels || []
    };
}