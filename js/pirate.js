
"use strict";

// Reusable Pirate class for all levels
export class Pirate {

    constructor(imagePath, x, deck, speed, direction = 1) {

        // Load the enemy pirate sprite sheet
        this.pirate_sprite_sheet = new Image();
        this.pirate_sprite_sheet.src = imagePath;

        // Store animation information
        this.pirate_current_frame = 0;
        this.pirate_frame_counter = 0;

        // Enemy pirate position
        this.pirateX = x;
        this.pirateY = 0;

        // Enemy pirate size
        this.pirateWidth = 90;
        this.pirateHeight = 95;

        // Pirate movement
        this.pirateSpeed = speed;
        this.pirateDirection = direction;

        // Deck where the pirate patrols
        this.pirateDeck = deck;
    }


    // Move the pirate automatically
    move(decks) {

        // Get the information for the pirate's deck
        const pirate_deck_info = decks[this.pirateDeck];

        if (!pirate_deck_info) {
            return;
        }

        // Position the pirate on the deck
        this.pirateY =
            pirate_deck_info.y - this.pirateHeight;

        // Move the pirate automatically
        this.pirateX +=
            this.pirateSpeed * this.pirateDirection;

        // Turn left at the right boundary
        if (
            this.pirateX + this.pirateWidth >=
            pirate_deck_info.endPoint
        ) {
            this.pirateX =
                pirate_deck_info.endPoint - this.pirateWidth;

            this.pirateDirection = -1;
        }

        // Turn right at the left boundary
        if (this.pirateX <= pirate_deck_info.startPoint) {

            this.pirateX = pirate_deck_info.startPoint;
            this.pirateDirection = 1;
        }
    }


    // Draw the pirate animation
    draw(context) {

        if (
            !this.pirate_sprite_sheet.complete ||
            this.pirate_sprite_sheet.naturalWidth === 0
        ) {
            return;
        }

        this.pirate_frame_counter++;

        if (this.pirate_frame_counter >= 8) {
            this.pirate_current_frame++;
            this.pirate_frame_counter = 0;
        }

        if (this.pirate_current_frame >= 4) {
            this.pirate_current_frame = 0;
        }

        const frame_width =
            this.pirate_sprite_sheet.width / 4;

        const frame_height =
            this.pirate_sprite_sheet.height / 2;

        const source_x =
            this.pirate_current_frame * frame_width;

        let source_y = 0;

        // Top row = right
        if (this.pirateDirection === 1) {
            source_y = 0;
        }

        // Bottom row = left
        if (this.pirateDirection === -1) {
            source_y = frame_height;
        }

        context.drawImage(
            this.pirate_sprite_sheet,
            source_x,
            source_y,
            frame_width,
            frame_height,
            this.pirateX,
            this.pirateY,
            this.pirateWidth,
            this.pirateHeight
        );
    }


    // Return pirate position for collision detection
    getPosition() {

        return {
            x: this.pirateX,
            y: this.pirateY,
            width: this.pirateWidth,
            height: this.pirateHeight,
            deck: this.pirateDeck
        };
    }
}


// Create the original Level 2 pirate
const level2Pirate = new Pirate(
    "../assets/images/pirate-sprite-sheet.png",
    300,
    3,
    2,
    1
);


// Keep the existing Level 2 functions working
export function move_pirate(decks) {
    level2Pirate.move(decks);
}

export function draw_pirate(context) {
    level2Pirate.draw(context);
}

export function get_pirate_position() {
    return level2Pirate.getPosition();
}
