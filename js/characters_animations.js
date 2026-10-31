    "use strict";

    // =========== This file creates two classes      =====
    // =========== "Player_Fl1nk", and "Pirate" Class =====
    // ===========      to use it in game.js          =====

    // import fl1nk spirate sheet animation data 
    import { fl1nkAnimationData } from "./fl1nk_spirate_animation.js";

    ////////////////////////////////////////////
    // PLayer Fl1nk movement and animation class
    //////////////////////////////////////////

    export class Player_Fl1nk {

        // intilize fl1nk's properties
        constructor(context, levelData) {

            // store canavs context  and level data
            this.context = context;
            this.decks = levelData.decks;
            this.ladders = levelData.ladders;

            // set fl1nk's dimentions and speed
            this.width = 80;
            this.height = 85;
            this.speed = 4;
            this.climbSpeed = 3;

            // fl1nk intial state position
            this.currentDeck = 1;
            this.horizontal_position = 910;
            this.vertical_position = this.decks[this.currentDeck].y - this.height;

            // setting fl1nk animation properties
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
            this.climb_fl1nk();

            this.previousUp = keys["ArrowUp"];
            this.previousDown = keys["ArrowDown"];
            return;
        }

        // control fl1nk's left and right movement
        if (keys["ArrowRight"]) {
            this.horizontal_position += this.speed;
            this.direction = "right";
            moving = true;

        } else if (keys["ArrowLeft"]) {
            this.horizontal_position -= this.speed;
            this.direction = "left";
            moving = true;
        }

        // ensuring fl1nk stays within the ship boundires
        this.deck_boundaries(this.decks[this.currentDeck]);

        // check arrow keys to start climbing
        if (keys["ArrowUp"]) {

            if (this.previousUp === false) {
                if (this.Use_the_Ladder(true)) {
                    moving = true;
                }
            }

        } else if (keys["ArrowDown"]) {

            if (this.previousDown === false) {
                if (this.Use_the_Ladder(false)) {
                    moving = true;
                }
            }
        }

        // remember the arrows pressed
        this.previousUp = keys["ArrowUp"];
        this.previousDown = keys["ArrowDown"];

        // animate fl1nk while moving else give fl1nk's idle face
        if (moving) {
            this.animate_fl1nk();
        } else {
            this.direction = "front";
            this.currentFrame = 0;
            this.animationCounter = 0;
        }
    }


        // Ensuring fl1nk stays within allowed limits of the ship
        deck_boundaries(deck) {

            // controlling left boundary of ship
            if (this.horizontal_position < deck.startPoint) {
                this.horizontal_position = deck.startPoint;
            }

            // controlling right boundary of ship
            if (this.horizontal_position > deck.endPoint) {
                this.horizontal_position = deck.endPoint;
            }
        }



        // Finding the ladder near to fl1nk
        Use_the_Ladder(going_up) {

            // checking each ladder in the json file
            for (let i = 0; i < this.ladders.length; i++) {

                let ladder = this.ladders[i]; // get each ladder

                // checking if fl1nk has to climb up or down
                if (going_up) {
                    if (ladder.bottomPoint != this.currentDeck) {
                        continue;
                    }
                } else {
                    if (ladder.topPoint != this.currentDeck) {
                        continue;
                    }
                }

                // check if fl1nk is within 30 pixels of the ladder
                let distance = Math.abs(this.horizontal_position - ladder.x);

                if (distance > 30) {
                    continue;
                }

                // finding the target deck based on ladder direction
                if (going_up) {
                    this.targetDeck = ladder.topPoint;
                } else {
                    this.targetDeck = ladder.bottomPoint;
                }

                // Position fl1nk to centre and climb fl1nk up
                this.horizontal_position = ladder.x - this.width / 2;
                this.direction = "up";
                this.climbing = true;
                this.currentFrame = 0;
                this.animationCounter = 0;

                return true;
            }
            return false;
        }


        climb_fl1nk() {

        // finding position on deck
        let y_position = this.decks[this.targetDeck].y - this.height;

        // fl1nk climbing animation
        this.direction = "up";
        this.animate_fl1nk();

        // moving fl1nk up or down depending on current position
        if (this.vertical_position > y_position) {
            this.vertical_position -= this.climbSpeed;

        } else if (this.vertical_position < y_position) {
            this.vertical_position += this.climbSpeed;
        }

        // Check if fl1nk is almost close to target deck
        if (this.vertical_position >= y_position - this.climbSpeed) {
            if (this.vertical_position <= y_position + this.climbSpeed) {

            // update fl1nk's positions and reset to idle state
            this.vertical_position = y_position;
            this.currentDeck = this.targetDeck;
            this.climbing = false;
            this.targetDeck = null;

            this.direction = "front";
            this.currentFrame = 0;
            this.animationCounter = 0;
        }}
    }


        animate_fl1nk() {

            // Animate fl1nk and reset when reached last frame
            this.animationCounter = this.animationCounter + 1

            if (this.animationCounter == 5) {
                this.currentFrame = this.currentFrame + 1

                if (this.currentFrame == 4) {
                this.currentFrame = 0;
                }
                this.animationCounter = 0;
            }
        }


        // Draw and animate fl1nk character
        draw_fl1nk() {

        // display spirate sheet row based on direction 
        let row = 0;
        if (this.direction == "left") {
            row = 1;
        } else if (this.direction == "right") {
            row = 2;
        } else if (this.direction == "up") {
            row = 3;
        }

        // get the frames in spirate sheet, and set fl1nk's dimentions
        let frame = this.animationData.fl1nk_frames[row * 4 + this.currentFrame];


        // Finally draw fl1nk on canvas
        this.context.drawImage(
            this.image,
            frame.position.x, frame.position.y,
            317, 310.25,
            this.horizontal_position, this.vertical_position,
            this.width, this.height
        );
    }
    }

    ////////////////////////////////
    // Patrolling Pirate animations
    ////////////////////////////////
    export class Pirate {

        constructor(image_path, x_pos, deck, speed, direction = 1) {

            // Loading the sprite sheet
            this.pirate_sprite_sheet = new Image();
            this.pirate_sprite_sheet.src = image_path;

            // set pirate dimentions and size
            this.pirateX = x_pos;
            this.pirateY = 0;
            this.pirateWidth = 90;
            this.pirateHeight = 95;

            // setting pirates movement properties
            this.pirateSpeed = speed;
            this.pirateDirection = direction;
            this.pirateDeck = deck;

            // pirate's animations
            this.pirate_frame_counter = 0;
            this.pirate_current_frame = 0;
        }


        // make the pirates move 
        move(decks) {

            // Get pirate's deck info  
            let deck = decks[this.pirateDeck];
            this.pirateY = deck.y - this.pirateHeight;
            this.pirateX += this.pirateSpeed * this.pirateDirection;

            // turing pirates left and right when they reach the ship boundary
            if (this.pirateX >= deck.endPoint - this.pirateWidth) {
                this.pirateDirection = -1;

            } else if (this.pirateX <= deck.startPoint) {
                this.pirateDirection = 1;
            }
        }


        // draw the pirate animations
        draw(context) { 

            // increment the animation counter
            this.pirate_frame_counter =  this.pirate_frame_counter + 1

            if (this.pirate_frame_counter == 8) {
                this.pirate_current_frame++;

                if (this.pirate_current_frame == 4) {
                    this.pirate_current_frame = 0;
                }   
                this.pirate_frame_counter = 0;
            }             

            // Get sprite frame size
            let frame_width = this.pirate_sprite_sheet.width / 4;
            let frame_height = this.pirate_sprite_sheet.height / 2;

            // Get animation frame position
            let frame_x = this.pirate_current_frame * frame_width;
            let frame_y = 0;

            // Use bottom row when pirate moves left
            if (this.pirateDirection == -1) {
                frame_y = frame_height;
            }

            context.drawImage(
                this.pirate_sprite_sheet,
                frame_x, frame_y,
                frame_width, frame_height,
                this.pirateX, this.pirateY,
                this.pirateWidth, this.pirateHeight
            );
        }

        }
