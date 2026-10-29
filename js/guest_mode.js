
"use strict";

// ============== Guest Player Popup ==============

// Get the popup and guest button
let guestPopup = document.getElementById("guest_user_popup");
let guestButton = document.getElementById("guest_button");

// Get the logged-in player's email
let guestPlayerEmail = sessionStorage.getItem("loggedInUserEmail");

// Check whether the player previously selected guest mode
let guestMode = sessionStorage.getItem("fl1nkGuestMode");

// Hide the popup initially
guestPopup.style.display = "none";

// Show popup only when player is not logged in
if (!guestPlayerEmail && guestMode !== "true") {
    guestPopup.style.display = "flex";
}

// When player clicks Play as Guest
guestButton.addEventListener("click", function() {

    // Remember guest selection for this session
    sessionStorage.setItem("fl1nkGuestMode", "true");

    // Hide the popup
    guestPopup.style.display = "none";
});
