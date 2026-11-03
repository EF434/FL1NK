"use strict";

//////////////////////////////////////////
// Add dynamic typing affect on home page
////////////////////////////////////////////

function typing_animation()  {
    const first_part = document.querySelector("#first-line");
    const second_part = document.querySelector("#second-line");

    const first_text = "THE MAZE";
    const second_text = "WON'T STAY STILL";

    function textTypingEffect(element, text, i = 0) {
        if (i < text.length) {
            element.textContent += text[i];
            setTimeout(() => textTypingEffect(element, text, i + 1), 100);
            
        } else if (element === first_part) {
            textTypingEffect(second_part, second_text);
        }
    }

    textTypingEffect(first_part, first_text);
}

// run typing affect only on home page
if (document.getElementById("first-line")) {
    typing_animation();
}

/////////////////////////////////////////
// Display the navbar profile
/////////////////////////////////////////
function displayNavbarProfile() {

    // get the profile pic for navbar and validate it
    let profile = document.getElementById("nav-profile-pic");

    if (profile == null) {
        return;
    }

    // check if player registered or playing as guest
    let registered_user = sessionStorage.getItem("loggedInUserEmail");
    let guest_user = sessionStorage.getItem("fl1nkGuestMode");

    // Get the navbar profile elements
    let profileButton = document.getElementById("nav-profile");
    let profilePicture = document.getElementById("user_pic");
    let profileDropdown = document.getElementById("nav-profile-dropdown");
    let username = document.getElementById("nav-profile-usrname");
    let score = document.getElementById("nav-profile-score");
    let logoutButton = profileDropdown.querySelector(".navbar-logout-button");

    profile.hidden = true; // hide profile by default

    ///////////////////
    // Registered player
    ///////////////////
    if (registered_user) {

        const saved_player = localStorage.getItem(registered_user);

        if (saved_player == null) {
            return;
        }

        const player = JSON.parse(saved_player);

        if (player.profileImage) {
            profilePicture.src = player.profileImage;}

        else{
            profilePicture.src = "../assets/images/default_pic.png";
        }

        username.textContent = player.username;
        score.textContent = "Total Score: " + player.totalScore;
        logoutButton.textContent = "Logout";

        profile.hidden = false;
    }
    ////////////////
    // Guest player
    ////////////////
    else if (guest_user === "true") {

        profile.hidden = false;
        profilePicture.src = "../assets/images/default_pic.png";
        username.textContent = "Guest";

        let guest_score = sessionStorage.getItem("fl1nkGuestScore");

        if (guest_score == null) {
            guest_score = 0;
        }   
        score.textContent = "Total Score: " + guest_score;
        logoutButton.textContent = "Exit Guest";
    }

    // Open and close profile dropdown
    profileButton.onclick = function() {
        if (profileDropdown.style.display === "block") {
            profileDropdown.style.display = "none";
        }
        else {
            profileDropdown.style.display = "block";
        }
    };
}

////////////////////////////////////
// Functionality for logout button
/////////////////////////////////////
function logout() {

    // clear session storage for registered or guest player
    sessionStorage.removeItem("loggedInUserEmail");
    sessionStorage.removeItem("fl1nkGuestMode");
    sessionStorage.removeItem("fl1nkGuestScore");
    sessionStorage.removeItem("fl1nkGuestLevelScores");

    window.location.href = "../index.html"; // redirect to home page
}

window.logout = logout;
window.displayNavbarProfile = displayNavbarProfile;

/////////////////////////////////////////////////////
// Disable login/register button if user is logged in
/////////////////////////////////////////////////////
let logged_in_user  = sessionStorage.getItem("loggedInUserEmail");
let login_button = document.getElementById("login-register-button");

if (login_button) {
    if (logged_in_user) {
        // make the buttom unclickable and change the style of it
        login_button.removeAttribute("href");
        login_button.style.opacity = "0.5";
        login_button.style.cursor = "not-allowed";
    }
}
displayNavbarProfile();
