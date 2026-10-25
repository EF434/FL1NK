
"use strict";

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
