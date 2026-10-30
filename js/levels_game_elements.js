"use strict";

// Class for the key and treasure
export class KeyTreasure {

    constructor(keyPath, treasureClosedPath, treasureOpenPath,
                keyX, keyDeck, keyWidth, keyHeight, treasureX, treasureDeck,
                treasureWidth, treasureHeight) {

        // Key and treasure images
        this.keyImage = new Image();
        this.keyImage.src = keyPath;

        this.treasureClosedImage = new Image();
        this.treasureClosedImage.src = treasureClosedPath;

        this.treasureOpenImage = new Image();
        this.treasureOpenImage.src = treasureOpenPath;

        // Treasure opening sound
        this.treasureSound = new Audio("../assets/sounds/treasure.mp3");

        // Key position and size
        this.keyX = keyX;
        this.keyDeck = keyDeck;
        this.keyWidth = keyWidth;
        this.keyHeight = keyHeight;

        // Treasure position and size
        this.treasureX = treasureX;
        this.treasureDeck = treasureDeck;
        this.treasureWidth = treasureWidth;
        this.treasureHeight = treasureHeight;

        // Key and treasure status
        this.hasKey = false;
        this.treasureIsOpen = false;
    }

    // Draw an image only after it has loaded successfully
    drawLoadedImage(context, image, x, y, width, height) {

        if (image.complete && image.naturalWidth > 0) {
            context.drawImage(image, x, y, width, height);
        }
    }

    // Draw the key and treasure on their decks
    draw(context, decks) {

        const keyPlatform = decks[this.keyDeck];
        const treasurePlatform = decks[this.treasureDeck];

        if (!this.hasKey && keyPlatform) {

            this.drawLoadedImage(
                context,
                this.keyImage,
                this.keyX,
                keyPlatform.y - this.keyHeight,
                this.keyWidth,
                this.keyHeight
            );
        }

        if (treasurePlatform) {

            const treasureImage = this.treasureIsOpen
                ? this.treasureOpenImage
                : this.treasureClosedImage;

            this.drawLoadedImage(
                context,
                treasureImage,
                this.treasureX,
                treasurePlatform.y - this.treasureHeight,
                this.treasureWidth,
                this.treasureHeight
            );
        }
    }

    // Check whether FL1NK is on a deck and overlaps an item horizontally
    touchesItem(player, x, width, deck) {

        return player.currentDeck === deck &&
            player.xPos < x + width &&
            player.xPos + player.width > x;
    }

    // Check key and treasure interactions
    checkCollision(player) {

        if (player.climbing) {
            return;
        }

        // Collect the key
        if (
            !this.hasKey &&
            this.touchesItem(
                player,
                this.keyX,
                this.keyWidth,
                this.keyDeck
            )
        ) {
            this.hasKey = true;

            // Show the green tick on the information board
            const keyTick = document.getElementById("key-tick");

            if (keyTick) {
                keyTick.style.display = "block";
            }

            console.log("Key collected!");
        }

        // Open the treasure if FL1NK has the key
        if (
            this.hasKey &&
            !this.treasureIsOpen &&
            this.touchesItem(
                player,
                this.treasureX,
                this.treasureWidth,
                this.treasureDeck
            )
        ) {
            this.treasureIsOpen = true;

            this.treasureSound.currentTime = 0;
            this.treasureSound.play().catch(() => {
                // The game continues if the browser blocks audio.
            });

            console.log("Treasure opened!");
        }
    }
}



// Class for the shield power-up
export class Shield {

    constructor(imagePath, shieldX, shieldDeck) {

        // Load the shield image
        this.shieldImage = new Image();
        this.shieldImage.src = imagePath;

        // Shield position and size
        this.shieldX = shieldX;
        this.shieldDeck = shieldDeck;
        this.shieldWidth = 65;
        this.shieldHeight = 65;

        // Shield timer
        this.shieldDuration = 10;
        this.shieldEndTime = 0;

        // Shield status
        this.shieldCollected = false;
        this.shieldActive = false;
    }

    // Check whether FL1NK touches the shield
    checkCollision(player) {

        if (this.shieldCollected || player.climbing) {
            return;
        }

        if (
            player.currentDeck === this.shieldDeck &&
            player.xPos < this.shieldX + this.shieldWidth &&
            player.xPos + player.width > this.shieldX
        ) {
            this.shieldCollected = true;
            this.shieldActive = true;

            // Start the countdown
            this.shieldEndTime = Date.now() + this.shieldDuration * 1000;

            // Show the green tick on the information board
            const shieldTick = document.getElementById("shield-tick");

            if (shieldTick) {
                shieldTick.style.display = "block";
            }

            console.log("Shield collected!");
        }
    }

    // Check whether shield protection is active
    isActive() {

        if (this.shieldActive && Date.now() >= this.shieldEndTime) {
            this.shieldActive = false;
            console.log("Shield expired!");
        }

        return this.shieldActive;
    }

    // Stop the shield after collecting the key
    stop() {
        this.shieldActive = false;
    }

    // Draw the shield on its deck
    draw(context, decks) {

        const shieldPlatform = decks[this.shieldDeck];

        if (
            !this.shieldCollected &&
            shieldPlatform &&
            this.shieldImage.complete &&
            this.shieldImage.naturalWidth > 0
        ) {
            context.drawImage(
                this.shieldImage,
                this.shieldX,
                shieldPlatform.y - this.shieldHeight,
                this.shieldWidth,
                this.shieldHeight
            );
        }

        // Get shield countdown elements
        const shieldDisplay = document.getElementById("game_shield");
        const shieldTime = document.getElementById("shield-time");
        const shieldProgress = document.getElementById("progress-bar");

        if (this.isActive()) {

            // Calculate the remaining time
            const timeLeft = Math.max(
                0,
                this.shieldEndTime - Date.now()
            );

            const secondsLeft = Math.ceil(timeLeft / 1000);

            // Calculate the progress bar percentage
            const progressPercentage =
                (timeLeft / (this.shieldDuration * 1000)) * 100;

            // Show the shield progress bar
            shieldDisplay.style.display = "block";

            // Update the countdown
            shieldTime.textContent = secondsLeft + "s";

            // Reduce the progress bar
            shieldProgress.style.width = progressPercentage + "%";

            // Change the bar to red when 3 seconds remain
            if (secondsLeft <= 3) {
                shieldProgress.classList.add("shield-warning");
            } else {
                shieldProgress.classList.remove("shield-warning");
            }

        } else {

            // Hide the shield progress bar
            shieldDisplay.style.display = "none";
        }
    }
}



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



// Class for the shield power-up
export class Shield {

    constructor(imagePath, shieldX, shieldDeck) {

        // Load the shield image
        this.shieldImage = new Image();
        this.shieldImage.src = imagePath;

        // Shield position and size
        this.shieldX = shieldX;
        this.shieldDeck = shieldDeck;
        this.shieldWidth = 65;
        this.shieldHeight = 65;

        // Shield timer
        this.shieldDuration = 10;
        this.shieldEndTime = 0;

        // Shield status
        this.shieldCollected = false;
        this.shieldActive = false;
    }

    // Check whether FL1NK touches the shield
    checkCollision(player) {

        if (this.shieldCollected || player.climbing) {
            return;
        }

        if (
            player.currentDeck === this.shieldDeck &&
            player.xPos < this.shieldX + this.shieldWidth &&
            player.xPos + player.width > this.shieldX
        ) {
            this.shieldCollected = true;
            this.shieldActive = true;

            // Start the countdown
            this.shieldEndTime = Date.now() + this.shieldDuration * 1000;

            // Show the green tick on the information board
            const shieldTick = document.getElementById("shield-tick");

            if (shieldTick) {
                shieldTick.style.display = "block";
            }

            console.log("Shield collected!");
        }
    }

    // Check whether shield protection is active
    isActive() {

        if (this.shieldActive && Date.now() >= this.shieldEndTime) {
            this.shieldActive = false;
            console.log("Shield expired!");
        }

        return this.shieldActive;
    }

    // Stop the shield after collecting the key
    stop() {
        this.shieldActive = false;
    }

    // Draw the shield on its deck
    draw(context, decks) {

        const shieldPlatform = decks[this.shieldDeck];

        if (
            !this.shieldCollected &&
            shieldPlatform &&
            this.shieldImage.complete &&
            this.shieldImage.naturalWidth > 0
        ) {
            context.drawImage(
                this.shieldImage,
                this.shieldX,
                shieldPlatform.y - this.shieldHeight,
                this.shieldWidth,
                this.shieldHeight
            );
        }

        // Get shield countdown elements
        const shieldDisplay = document.getElementById("game_shield");
        const shieldTime = document.getElementById("shield-time");
        const shieldProgress = document.getElementById("progress-bar");

        if (this.isActive()) {

            // Calculate the remaining time
            const timeLeft = Math.max(
                0,
                this.shieldEndTime - Date.now()
            );

            const secondsLeft = Math.ceil(timeLeft / 1000);

            // Calculate the progress bar percentage
            const progressPercentage =
                (timeLeft / (this.shieldDuration * 1000)) * 100;

            // Show the shield progress bar
            shieldDisplay.style.display = "block";

            // Update the countdown
            shieldTime.textContent = secondsLeft + "s";

            // Reduce the progress bar
            shieldProgress.style.width = progressPercentage + "%";

            // Change the bar to red when 3 seconds remain
            if (secondsLeft <= 3) {
                shieldProgress.classList.add("shield-warning");
            } else {
                shieldProgress.classList.remove("shield-warning");
            }

        } else {

            // Hide the shield progress bar
            shieldDisplay.style.display = "none";
        }
    }
}
