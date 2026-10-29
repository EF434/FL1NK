

// display the username and the score of logged in user
function displayNavbarProfile() {

    // Get user's details and verify it it exists
    let playerEmail = sessionStorage.getItem("loggedInUserEmail");
    if (playerEmail == null) {
        return;
    }
    let profile = document.getElementById("nav-profile-pic");
    let savedPlayer = localStorage.getItem(playerEmail);
    let player = JSON.parse(savedPlayer);

    // get all the html elemets ids
    let profileButton = document.getElementById("nav-profile");
    let profilePicture = document.getElementById("user_pic");
    let profileDropdown = document.getElementById("nav-profile-dropdown");
    let username = document.getElementById("nav-profile-usrname");
    let score = document.getElementById("nav-profile-score");

    // display the provided pic or else the default pic
    if (player.profileImage) {
        profilePicture.src = player.profileImage;
    } else {
        profilePicture.src = "../assets/images/default_pic.png";
    }

    // Display username and total score
    profile.hidden = false;
    username.textContent = player.username;
    score.textContent = `Total Score: ${player.totalScore}`;
    

    // open close the dropdown
    profileButton.onclick = function() {

        if (profileDropdown.style.display == "block") {
            profileDropdown.style.display = "none";
        }
        else {
            profileDropdown.style.display = "block";
        }

    };
}

// redirect to home page
function logout() {
    sessionStorage.removeItem("loggedInUserEmail");
    window.location.href = "../index.html";
}

// display profile 
displayNavbarProfile();
