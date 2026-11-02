
"use strict";
///////////////////////////////////////////
//   Store user data in local storage and
//         display the scoreboard
///////////////////////////////////////////
export function save_users_score(level_number, currentScore) {

    // get user's email, and validate that it exists
    let email = sessionStorage.getItem("loggedInUserEmail");

    if (email == null) {
        return;
    }

    // get player's data from local storage and validate if it exsists
    let player = JSON.parse(localStorage.getItem(email));

    if (player == null) {
        return;
    }

    // get level number and score 
    let level = Number(level_number);
    let score = Number(currentScore);


    // update the highest score for levels
    if (score > player.levelScores[level]) {
        player.levelScores[level] = score;
    }

    // Add the completed levels
    if (player.completedLevels.length < level) {
        player.completedLevels.push(level);
    }

    // Calculate the player's total score and update 
    player.totalScore = player.levelScores[1] + player.levelScores[2] + player.levelScores[3];
    localStorage.setItem(email, JSON.stringify(player));
}


///////////////////////////////////////////////////////
// Temporarly store guest score's in session storage
///////////////////////////////////////////////////////
export function save_guest_score(level_number, currentScore) {

    // get level number and score 
    let level = Number(level_number);
    let score = Number(currentScore);

    // get guest's updated scores
    let guest_scores = JSON.parse(sessionStorage.getItem("fl1nkGuestLevelScores"));

    // create scores for new user
    if (!guest_scores) {
        guest_scores = {1: 0, 2: 0, 3: 0};
    }

    //  save high score
    if (score > guest_scores[level]) {
        guest_scores[level] = score;
    }

    // calculaye total score
    let totalScore = guest_scores[1] + guest_scores[2] + guest_scores[3];

    // save guests scores temporarily via session storage
    sessionStorage.setItem("fl1nkGuestLevelScores", JSON.stringify(guest_scores));
    sessionStorage.setItem("fl1nkGuestScore", totalScore);
}

// ==========================================
// GET ALL REGISTERED PLAYERS
// ==========================================

function getRegisteredPlayers() {

    let players = [];

    // Check all accounts in localStorage
    for (let i = 0; i < localStorage.length; i++) {

        let email = localStorage.key(i);
        let player;

        // Read the saved account
        try {
            player = JSON.parse(localStorage.getItem(email));
        }
        catch (error) {
            continue;
        }

        // Only include registered player accounts
        if (!player || player.email !== email || !player.username) {
            continue;
        }

        // Add player details to the leaderboard
        players.push({
            username: player.username,
            score: Number(player.totalScore || 0),
            profileImage: player.profileImage
        });
    }

    // Sort players by highest score
    players.sort(function(a, b) {

        if (a.score === b.score) {
            return a.username.localeCompare(b.username);
        }

        return b.score - a.score;
    });

    return players;
}


// ==========================================
// DISPLAY THE SCOREBOARD
// ==========================================

function displayLeaderboard() {

    let leaderboard = document.getElementById("leaderboard-players");

    if (!leaderboard) {
        return;
    }

    leaderboard.innerHTML = "";

    let email = sessionStorage.getItem("loggedInUserEmail");

    // Guest player sees only their own score
    if (!email) {

        let guestScore = sessionStorage.getItem("fl1nkGuestScore") || 0;

        let guestRow = document.createElement("div");
        guestRow.className = "user-card-content";

        guestRow.innerHTML = `
            <h3>-</h3>
            <img class="player-avatar"
                 src="../assets/images/default_pic.png"
                 alt="Guest Profile Picture">
            <h3>Guest</h3>
            <h3>${guestScore}</h3>
        `;

        leaderboard.appendChild(guestRow);
        return;
    }

    // Get all registered players
    let players = getRegisteredPlayers();

    if (players.length === 0) {
        leaderboard.innerHTML =
            "<p class='leaderboard-empty'>No players registered yet!</p>";
        return;
    }

    // Display each player on the scoreboard
    for (let i = 0; i < players.length; i++) {

        let player = players[i];

        let row = document.createElement("div");
        row.className = "user-card-content";

        // Highlight the top three players
        if (i === 0) {
            row.classList.add("first-place");
        }
        else if (i === 1) {
            row.classList.add("second-place");
        }
        else if (i === 2) {
            row.classList.add("third-place");
        }

        // Create the player's rank
        let rank = document.createElement("h3");
        rank.textContent = i + 1;

        // Create the player's profile picture
        let picture = document.createElement("img");
        picture.className = "player-avatar";
        picture.src = player.profileImage || "../assets/images/default_pic.png";
        picture.alt = "Player Profile Picture";

        // Create the player's username
        let username = document.createElement("h3");
        username.textContent = player.username;

        // Create the player's score
        let score = document.createElement("h3");
        score.textContent = player.score;

        // Add everything to the player's row
        row.appendChild(rank);
        row.appendChild(picture);
        row.appendChild(username);
        row.appendChild(score);

        // Add the row to the scoreboard
        leaderboard.appendChild(row);
    }
}

// Display the leaderboard when the page loads
displayLeaderboard();
