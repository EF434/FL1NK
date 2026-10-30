"use strict";

// <<<<<<<<<<<<<<<<<            The purpose of this file is for the animations         >>>>>
// <<<<<<<<<<<<<<<<< for the player Fl1nk and the patrolling pirates across the levels >>>>>

// import the logic in the file
import { fl1nkAnimationData } from "./fl1nk_spirate_animation.js";

// PLayer Fl1nk animations
export class Player_Fl1nk {

    // setting up the required variablles
    constructor(context, levelData) {

        // get game canavs and level data
        this.context = context;
        this.decks = levelData.decks;
        this.ladders = levelData.ladders;

        // Fl1nk design and movement
        this.width = 80;
        this.height = 85;
        this.speed = 4;
        this.climbSpeed = 3;
        this.distanceToLadder = 30;

        // fl1nk intial state position
        this.currentDeck = 1;
        this.xPos = 910;
        this.yPos = this.decks[this.currentDeck].y - this.height;

        // fl1nk animation variables
        this.direction = "front";
        this.currentFrame = 0;
        this.animationCounter = 0;

        this.climbing = false;
        this.targetDeck = null;
        this.previousUp = false;
        this.previousDown = false;

        // load the fl1nk spirte sheet
        this.image = new Image();
        this.image.src = "../assets/images/fl1nk-spirate-sheet.png";
        this.animationData = fl1nkAnimationData;

        // Keep FL1NK inside the starting deck
        this.deck_boundaries(this.decks[this.currentDeck]);
    }


    // Function to make fl1nk move using keyboard arrows
    move(keys) {

    let moving = false;

    // until fl1nk reaches the other deck, it keeps on climbing
    if (this.climbing) {
        this.climb();

        this.previousUp = keys["ArrowUp"];
        this.previousDown = keys["ArrowDown"];
        return;
    }

    // control fl1n's left and right movement
    if (keys["ArrowRight"]) {
        this.xPos += this.speed;
        this.direction = "right";
        moving = true;

    } else if (keys["ArrowLeft"]) {
        this.xPos -= this.speed;
        this.direction = "left";
        moving = true;
    }

    // ensuring fl1nk stays within the ship boundires
    this.deck_boundaries(this.decks[this.currentDeck]);

    // checking 'arrow up' and 'arrow down' conditions to movoe
    if (keys["ArrowUp"]) {

        if (this.previousUp === false) {
            if (this.useLadder(true)) {
                moving = true;
            }
        }

    } else if (keys["ArrowDown"]) {

        if (this.previousDown === false) {
            if (this.useLadder(false)) {
                moving = true;
            }
        }
    }

    // remember the arrows pressed
    this.previousUp = keys["ArrowUp"];
    this.previousDown = keys["ArrowDown"];

    // animate fl1nk while moving else give fl1nk's idle face
    if (moving) {
        this.animate();
    } else {
        this.direction = "front";
        this.currentFrame = 0;
        this.animationCounter = 0;
    }
}


    // Ensuring fl1nk stays within allowed limits of the ship
    deck_boundaries(deck) {

        // controlling left boundary of ship
        if (this.xPos < deck.startPoint) {
            this.xPos = deck.startPoint;
        }

        // controlling right boundary of ship
        if (this.xPos > deck.endPoint) {
            this.xPos = deck.endPoint;
        }
    }



    // Finding the ladder near to fl1nk
    useLadder(going_up) {

        // checking each ladder in the json file
        for (let i = 0; i < this.ladders.length; i++) {

            let ladder = this.ladders[i]; // get each ladder
            
            // Check if FL1NK can climb up
            if (going_up) {
                if (ladder.bottomPoint != this.currentDeck) {
                    continue;
                }
            }

            // Check if FL1NK can climb down
            else {
                if (ladder.topPoint != this.currentDeck) {
                    continue;
                }
            }

            // Calculate the distance between FL1NK and the ladder
            let distance = Math.abs(playerCenter - ladder.x);

            // Skip the ladder if FL1NK is too far away
            if (distance > this.distanceToLadder) {
                continue;
            }

            // Set the destination deck
            if (going_up) {
                this.targetDeck = ladder.topPoint;
            } else {
                this.targetDeck = ladder.bottomPoint;
            }

            // Position FL1NK at the ladder
            this.xPos = ladder.x - this.width / 2;

            // Start climbing animation
            this.direction = "up";
            this.climbing = true;
            this.currentFrame = 0;
            this.animationCounter = 0;

            return true;
        }

        // No suitable ladder found
        return false;
    }


    // ============== Climb Ladder ==============

    climb() {

        // Find destination position
        let targetY = this.decks[this.targetDeck].y - this.height;
        let distance = targetY - this.yPos;

        this.direction = "up";
        this.animate();

        // Check if FL1NK reached the destination
        if (Math.abs(distance) <= this.climbSpeed) {

            this.yPos = targetY;
            this.currentDeck = this.targetDeck;

            // Stop climbing
            this.climbing = false;
            this.targetDeck = null;

            // Reset animation
            this.direction = "front";
            this.currentFrame = 0;
            this.animationCounter = 0;

        } else if (distance > 0) {

            // Move downward
            this.yPos += this.climbSpeed;

        } else {

            // Move upward
            this.yPos -= this.climbSpeed;
        }
    }


    // ============== FL1NK Animation ==============

    animate() {

        this.animationCounter++;

        // Change frame after every five game updates
        if (this.animationCounter >= 5) {

            this.currentFrame = (this.currentFrame + 1) % 4;
            this.animationCounter = 0;
        }
    }


    // ============== Draw FL1NK ==============

    draw() {

        // Check if sprite sheet has loaded
        if (!this.image.complete || this.image.naturalWidth === 0) {
            return;
        }

        // Select animation row
        let row = 0;

        if (this.direction === "right") {
            row = 1;

        } else if (this.direction === "left") {
            row = 2;

        } else if (this.direction === "up") {
            row = 3;
        }

        // Get the current animation frame
        let frame = this.animationData.fl1nk_frames[
            row * 4 + this.currentFrame
        ];

        if (!frame) {
            return;
        }

        // Set character drawing size
        let drawWidth = frame.position.width * (90 / 256);
        let drawHeight = frame.position.height * (this.height / 256);

        // Draw FL1NK on the canvas
        this.context.drawImage(
            this.image,
            frame.position.x,
            frame.position.y,
            frame.position.width,
            frame.position.height,
            this.xPos + (this.width - drawWidth) / 2,
            this.yPos + this.height - drawHeight,
            drawWidth,
            drawHeight
        );
    }
}



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
