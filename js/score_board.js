"use strict";

// ============== FL1NK PLAYER SCORES ==============

// Save the player's score after completing a level
export function savePlayerScore(levelNumber, currentScore) {

    // Get the logged-in player's email
    const playerEmail = sessionStorage.getItem("loggedInUserEmail");

    // Check if the player is logged in
    if (!playerEmail) {
        console.log("Player is not logged in. Score not saved.");
        return;
    }

    // Get the player's registered account
    const savedPlayer = localStorage.getItem(playerEmail);

    if (!savedPlayer) {
        console.log("Player account not found.");
        return;
    }

    // Convert saved JSON into a JavaScript object
    const player = JSON.parse(savedPlayer);

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
    const level = Number(levelNumber);
    const score = Number(currentScore);

    // Check that the level and score are valid
    if (
        ![1, 2, 3].includes(level) ||
        !Number.isFinite(score) ||
        score < 0
    ) {
        console.log("Invalid level or score.");
        return;
    }

    // Get the player's previous best score for this level
    const previousScore = Number(player.levelScores[level] || 0);

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
    const playerEmail = sessionStorage.getItem("loggedInUserEmail");

    if (!playerEmail) {
        return null;
    }

    const savedPlayer = localStorage.getItem(playerEmail);

    if (!savedPlayer) {
        return null;
    }

    // Convert saved player data into a JavaScript object
    const player = JSON.parse(savedPlayer);

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


// get info from id
const leaderboardPlayers = document.getElementById("leaderboard-players");

// get info of registerd players
function getRegisteredPlayers() {

    // Store all registered players
    const players = [];

    // Go through localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const player = JSON.parse(localStorage.getItem(key));

        // Check if it is a registered player
        if (player == null) {
            continue;
        }

        if (player.email != key) {
            continue;
        }

        // Get the player's score
        const score = player.totalScore;
        players.push({ username: player.username, score: score });
    }

    // sort player's score high to low
    players.sort((player1, player2) => {
        // handle when two scores are the same
        if (player1.score == player2.score) {
            return player1.username.localeCompare(player2.username);
        }

        return player2.score - player1.score;
    });

    return players;
}


// Display the leaderboard
function displayLeaderboard() {
    if (!leaderboardPlayers) {
        return;
    }

    // Handle the scores of a guest player
    if (!sessionStorage.getItem("loggedInUserEmail")) {

        // get the score of guest player and display it
        const score = sessionStorage.getItem("fl1nkGuestScore");

        leaderboardPlayers.innerHTML = `
            <div class="user-card-content">
                <h3>-</h3>
                <h3>Guest</h3>
                <h3>${score}</h3>
            </div>`;

        return;
    }

    // get the score board content
    const players = getRegisteredPlayers();

    leaderboardPlayers.innerHTML = "";

    // if no players registered than display message
    if (players.length === 0) {
        leaderboardPlayers.innerHTML =
            "<p class='leaderboard-empty'>No players registered yet!</p>";
        return;
    }

    // display each player's rank, score and username
    for (let i = 0; i < players.length; i++) {
        const player = players[i]; // get each player

        // display content
        leaderboardPlayers.innerHTML +=
            `<div class="user-card-content">
                <h3>${i + 1}</h3>
                <h3>${player.username}</h3>
                <h3>${player.score}</h3>
            </div>`;
    }
}

displayLeaderboard();