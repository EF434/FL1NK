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