
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

    // loop over local sotrage to get all registered users info
    for (let i = 0; i < localStorage.length; i++) {
        let email = localStorage.key(i); 

        // validate the email
        if (email === "profile_image"){
            continue;
        }
        let player = JSON.parse(localStorage.getItem(email));

        // verify player's email and push their info
        if (player.email === email) {
            players.push({
                username: player.username,
                score: player.totalScore,
                profileImage: player.profileImage
            });
        }
    }

    // sort the higher score 
    players.sort(function(a, b) {
        return b.score - a.score;
    });
    return players;
}


////////////////////////////////////////
// Display users info on scoreboard 
////////////////////////////////////////
function display_scoreboard_results() {
    // get the player cards and do validation
    let leaderboard = document.getElementById("leaderboard-players");
    if (leaderboard == null) {
        return;
    }

    // clear everthing initially
    leaderboard.innerHTML = "";

    let email = sessionStorage.getItem("loggedInUserEmail");
    let players = [];
    let is_it_guest = false;


    if (email) {
        // get info and display message if empty initially 
        players = registered_users_info();

        if (players.length === 0) {
            leaderboard.innerHTML ="<p class='leaderboard-empty'>Scoreboard is empty yet!</p>";
            return;
        }

    } else {

        // handle guest player scores
        let guestScore = sessionStorage.getItem("fl1nkGuestScore");

        // Validate and push the guest scores and info
        if (guestScore === null) {
            guestScore = 0;
        }
        players.push({ username: "Guest", score: guestScore, profileImage: "../assets/images/default_pic.webp"});
        is_it_guest = true;
    }

    // loop over each player  and display on scoreboard
    for (let i = 0; i < players.length; i++) {
        let player = players[i];

        // create the player cards via Javascript using css
        let row = document.createElement("div");
        row.className = "user-card-content";
        let rank = document.createElement("h3");

        // show the rank
        if (is_it_guest) {
            rank.textContent = "-";
        } else {
            rank.textContent = i + 1;
        }

        // Add and display the profile picture
        let picture = document.createElement("img");
        picture.className = "player-avatar";
        picture.alt = "Player Profile Picture";

        // display default pics if not avaliable
        if (player.profileImage == null) {
            picture.src = "../assets/images/default_pic.webp";
        } else {
            picture.src = player.profileImage;
        }
    
        // headline elemts for score and username
        let username = document.createElement("h3");
        username.textContent = player.username;

        let score = document.createElement("h3");
        score.textContent = player.score;

        // add all the info
        row.append(rank, picture, username, score);
        leaderboard.append(row);
    }
}

display_scoreboard_results();