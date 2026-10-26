"use strict";

// ============== FL1NK SCOREBOARD ==============

// Get the leaderboard container
const leaderboardPlayers = document.getElementById("leaderboard-players");


// Get all registered players from localStorage
function getRegisteredPlayers() {

    let players = [];

    // Go through all saved information in localStorage
    for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);
        let savedData = localStorage.getItem(key);

        try {

            // Convert JSON data into a JavaScript object
            let player = JSON.parse(savedData);

            // Check whether the saved data belongs to a registered player
            if (
                player &&
                typeof player === "object" &&
                typeof player.email === "string" &&
                typeof player.username === "string" &&
                player.email === key
            ) {

                // Get the player's total best score
                let score = Number(player.totalScore || 0);

                // Add the player to the leaderboard array
                players.push({
                    username: player.username,
                    score: Number.isFinite(score) && score >= 0 ? score : 0
                });
            }

        } catch (error) {

            // Ignore other information saved in localStorage
            continue;
        }
    }

    // Sort players from highest score to lowest score
    players.sort(function(player1, player2) {

        if (player2.score !== player1.score) {
            return player2.score - player1.score;
        }

        return player1.username.localeCompare(player2.username);
    });

    return players;
}


// Display the registered players on the scoreboard
function displayLeaderboard() {

    let players = getRegisteredPlayers();

    // Clear the previous player cards
    leaderboardPlayers.innerHTML = "";

    // Display a message if there are no registered players
    if (players.length === 0) {

        let message = document.createElement("p");

        message.textContent = "No players registered yet!";
        message.className = "leaderboard-empty";

        leaderboardPlayers.appendChild(message);

        return;
    }

    // Create a scoreboard card for every registered player
    for (let i = 0; i < players.length; i++) {

        let player = players[i];

        // Create the player card
        let playerCard = document.createElement("div");
        playerCard.className = "user-card-content";

        // Create the rank
        let rank = document.createElement("h3");
        rank.textContent = i + 1;

        // Create the player username
        let username = document.createElement("h3");
        username.textContent = player.username;

        // Create the player's total score
        let score = document.createElement("h3");
        score.textContent = player.score;

        // Add rank, username and score to the player card
        playerCard.appendChild(rank);
        playerCard.appendChild(username);
        playerCard.appendChild(score);

        // Display the player card
        leaderboardPlayers.appendChild(playerCard);
    }
}


// Display the leaderboard when the page loads
displayLeaderboard();