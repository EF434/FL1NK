
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

        // Draw the countdown on the game canvas
        if (this.isActive()) {

            const secondsLeft = Math.ceil(
                (this.shieldEndTime - Date.now()) / 1000
            );

            context.save();

            context.fillStyle = "#ffffff";
            context.font = "bold 28px Arial";
            context.textAlign = "center";
            context.shadowColor = "#8b5cf6";
            context.shadowBlur = 12;

            context.fillText(
                "SHIELD: " + secondsLeft + "s",
                context.canvas.width / 2,
                60
            );

            context.restore();
        }
    }
}
