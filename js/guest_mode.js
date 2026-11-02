
"use strict";

/// <<< Display guest user popup if not regsitered >>>

// getting the popup image & button
let guestPopup = document.getElementById("guest_user_popup");
let guestButton = document.getElementById("guest_button");

if (guestPopup) {

    // checking if logged in already or continuing as guest
    let loggedInEmail = sessionStorage.getItem("loggedInUserEmail");
    let guestMode = sessionStorage.getItem("fl1nkGuestMode");

    guestPopup.style.display = "none";

    // display popup to new player
    if (loggedInEmail == null) {
        if (guestMode == null) {
            guestPopup.style.display = "flex";
        }
    }

    // session storage for guest user
    guestButton.onclick = function() {
        sessionStorage.setItem("fl1nkGuestMode", "true");
        guestPopup.style.display = "none";
    };
}