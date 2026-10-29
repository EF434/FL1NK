
"use strict";

// ============== FL1NK Level Locking ==============

// Get the logged-in player's email
let levelLockPlayerEmail = sessionStorage.getItem("loggedInUserEmail");

// Get the lock images
let level2Lock = document.getElementById("level2-lock");
let level3Lock = document.getElementById("level3-lock");

// Get the level buttons
let level2Button = document.getElementById("level2-button");
let level3Button = document.getElementById("level3-button");

// Check whether a registered player is logged in
if (levelLockPlayerEmail) {

    // Get the registered player's saved account
    let savedPlayer = localStorage.getItem(levelLockPlayerEmail);

    if (savedPlayer) {

        // Convert the saved JSON into a JavaScript object
        let player = JSON.parse(savedPlayer);

        // Get the levels completed by this player
        let completedLevels = player.completedLevels || [];

        // Lock Level 2 until Level 1 is completed
        if (!completedLevels.includes(1)) {

            level2Lock.style.display = "block";
            level2Button.removeAttribute("href");
            level2Button.textContent = "LOCKED";
            level2Button.classList.add("locked");
        }

        // Lock Level 3 until Level 2 is completed
        if (!completedLevels.includes(2)) {

            level3Lock.style.display = "block";
            level3Button.removeAttribute("href");
            level3Button.textContent = "LOCKED";
            level3Button.classList.add("locked");
        }
    }
}
