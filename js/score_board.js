
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

////////////////////////////////////////////
/// Get registered user's info for scoreboard
////////////////////////////////////////////
function registered_users_info() {
    let players = [];

    for (let i = 0; i < localStorage.length; i++) {
        let email = localStorage.key(i);
        let player = JSON.parse(localStorage.getItem(email));

        if (player.email === email) {
            players.push({
                username: player.username,
                score: player.totalScore,
                profileImage: player.profileImage
            });
        }
    }

    players.sort(function(a, b) {
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
    let players = [];
    let isGuest = false;

    if (email) {
        players = registered_users_info();

        if (players.length === 0) {
            leaderboard.innerHTML =
                "<p class='leaderboard-empty'>No players registered yet!</p>";
            return;
        }
    } else {
        let guestScore = sessionStorage.getItem("fl1nkGuestScore");

        if (guestScore === null) {
            guestScore = 0;
        }

        players.push({
            username: "Guest",
            score: guestScore,
            profileImage: "../assets/images/default_pic.png"
        });

        isGuest = true;
    }

    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        let row = document.createElement("div");
        row.className = "user-card-content";

        if (isGuest) {
            let rank = document.createElement("h3");
            rank.textContent = "-";
            row.appendChild(rank);
        } else {
            let rank = document.createElement("h3");
            rank.textContent = i + 1;
            row.appendChild(rank);

            if (i === 0) {
                row.classList.add("first-place");
            } else if (i === 1) {
                row.classList.add("second-place");
            } else if (i === 2) {
                row.classList.add("third-place");
            }
        }

        let picture = document.createElement("img");
        picture.className = "player-avatar";
        picture.alt = "Player Profile Picture";
        picture.src = player.profileImage;

        if (!player.profileImage) {
            picture.src = "../assets/images/default_pic.png";
        }

        let username = document.createElement("h3");
        username.textContent = player.username;

        let score = document.createElement("h3");
        score.textContent = player.score;

        row.appendChild(picture);
        row.appendChild(username);
        row.appendChild(score);

        leaderboard.appendChild(row);
    }
}

displayLeaderboard();