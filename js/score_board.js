
// get info from id
let leaderboardPlayers = document.getElementById("leaderboard-players");

// get info of registerd players
function getRegisteredPlayers() {

    // Store all registered players
    let players = [];

    // Go through localStorage
    let i = 0 
    for (; i < localStorage.length; i++) {

        let key = localStorage.key(i);
        let player = JSON.parse(localStorage.getItem(key));

        // Check if it is a registered player
        if (player == null) {
            continue;
        }

        if (player.email != key) {
            continue;
        }

        // Get the player's score
        let score = player.totalScore;
        players.push({username: player.username, score: score});
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

    // get the score board content
    let players = getRegisteredPlayers();

    leaderboardPlayers.innerHTML = "";

    // if no players registered than display message
    if (players.length == 0) {
        leaderboardPlayers.innerHTML = 
        "<p class='leaderboard-empty'>No players registered yet!</p>";
        return;
    }

    // display each player's rank, score and username
    let i = 0;
    for (; i < players.length; i++) {

        let player = players[i]; // get each player

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
