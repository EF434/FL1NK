"use strict";


/////// This file is a shared file for Key, Treasure and Shield logic     ///////
/////// It consists of two classess for handle this logic across 3 levels ///////

///////////////////////////////////////
//         Key and Treasure Class
//////////////////////////////////////
export class KeyTreasure {

    constructor(key, treasure) {

        this.key = key;
        this.treasure = treasure;

        // Set key image
        this.key_image = new Image();
        this.key_image.src = key.image;

        // set treasure image when closed and open
        this.treasure_closed_img = new Image();
        this.treasure_closed_img.src = treasure.treasure_closed_img;

        this.treasure_open_img = new Image();
        this.treasure_open_img.src = treasure.treasure_open_img;

        // Treasure and key sound
        this.treasure_sound = new Audio("../assets/sounds/treasure.mp3");
        this.key_sound = new Audio("../assets/sounds/key.mp3");

        // key and treasure status
        this.collected_key = false;
        this.unlocked_treasure = false;
    }

    draw(context, decks) {

        // find the deck wkere the key and treasure is
        const key_deck = decks[this.key.deck];
        const treasure_Deck = decks[this.treasure.deck];

        // draw the key  on deck if fl1nk didn't collect it 
        if (!this.collected_key && key_deck) {
            context.drawImage(
                this.key_image,
                this.key.x, key_deck.y - this.key.height,
                this.key.width, this.key.height
            );
        }

        // draw the treasure image
        if (treasure_Deck) {
            let image = this.treasure_closed_img; // load image

            // if treasure open display the relavent image
            if (this.unlocked_treasure === true) {
                image = this.treasure_open_img;
            }

            // draw the image
            if (image.complete) {
                context.drawImage(
                    image,
                    this.treasure.x, treasure_Deck.y - this.treasure.height,
                    this.treasure.width, this.treasure.height
                );
            }
        }
    }

    checkCollision(player) {

        // if climbing then do nothing
        if (player.climbing) {
            return;
        }

        // Arrow fucntion to check if player touches an item on the same deck
        const touches = (item) => {
            if (player.currentDeck !== item.deck) {
                return false;
            }

            if (player.horizontal_position >= item.x + item.width) {
                return false;
            }

            if (player.horizontal_position + player.width <= item.x) {
                return false;
            }

            return true;
        };

        if (!this.collected_key) {
            if (touches(this.key)) {
                this.collected_key = true;

                const key_tick = document.getElementById("key-tick");

                if (key_tick) {
                    key_tick.style.display = "block";
                }

                this.key_sound.currentTime = 0;
                this.key_sound.play();
            }
        }

        // open treasure after key is collected
        if (this.collected_key) {
            if (!this.unlocked_treasure) {
                if (touches(this.treasure)) {
                    // open treasure and play the sound
                    this.unlocked_treasure = true;
                    this.treasure_sound.currentTime = 0;
                    this.treasure_sound.play();
                }
            }
        }
        
    }
}



////////////////////////////////////////////
//          Shield Class for level 2
////////////////////////////////////////////
export class Shield {

    constructor(image_path, shieldX, shieldDeck) {

        // load the shield image
        this.shieldImage = new Image();
        this.shieldImage.src = image_path;

        // set shield position and dimentions
        this.shieldX = shieldX;
        this.shieldDeck = shieldDeck;
        this.shieldWidth = 65;
        this.shieldHeight = 65;

        // set shield status
        this.shield_collected = false;
        this.shield_active = false;
    }

    // Check whether FL1NK touches the shield
    checkCollision(player) {

        // don't collect if already collected
        if (this.shield_collected) {
            return;
        }

        // only collect if deck and shield on same deck
        if (player.currentDeck !== this.shieldDeck) {
            return;
        }

        // check whether player touches the shield
        const playerLeft = player.horizontal_position;
        const playerRight = playerLeft + player.width;
        const shieldLeft = this.shieldX;
        const shieldRight = shieldLeft + this.shieldWidth;

        if (playerRight <= shieldLeft) {
            return;
        }

        if (playerLeft >= shieldRight) {
            return;
        }

        // When fl1nk collects shield, activate timer, and display tick 
        this.shield_collected = true;
        this.shield_active = true;
        this.shieldTimeLeft = 10;

        const shield_tick = document.getElementById("shield-tick");
        const display_shield = document.getElementById("game_shield");
        const shieldTime = document.getElementById("shield-time");
        const progress_bar = document.getElementById("progress-bar");

        // display the tick & start timer
        if (shield_tick) {
            shield_tick.style.display = "block";
        }

        if (display_shield) {
            display_shield.style.display = "block";
        }

        if (shieldTime) {
            shieldTime.textContent = this.shieldTimeLeft + "s";
        }

        if (progress_bar) {
            progress_bar.style.width = "100%";
            progress_bar.classList.remove("shield-warning");
        }


        // control the timer when fl1nk collects it
        this.shieldTimer = setInterval(() => {
            this.shieldTimeLeft--;

            // display the updated time
            if (shieldTime) {
                shieldTime.textContent = this.shieldTimeLeft + "s";
            }

            // if the progress is still there then update it
            if (progress_bar) {
                const updated_time = this.shieldTimeLeft / 10;
                progress_bar.style.width = (updated_time * 100) + "%";

                // if 3s are remaing then display red in progress bar
                if (this.shieldTimeLeft <= 3) {
                    progress_bar.classList.add("shield-warning");
                }
            }

            // stop it if no time remaning
            if (this.shieldTimeLeft <= 0) {
                this.stop();
            }
        }, 1000);}

        


        // draw the shield image until fl1nk collects it
        draw(context, decks) {
            const shield_deck = decks[this.shieldDeck];

            if (!this.shield_collected && shield_deck) {
                context.drawImage(
                    this.shieldImage,
                    this.shieldX, shield_deck.y - this.shieldHeight,
                    this.shieldWidth, this.shieldHeight
                );
            }
        }
        
        // stop shield timer and hide it from display
        stop() {
            clearInterval(this.shieldTimer);
            this.shield_active = false;

            const display_shield = document.getElementById("game_shield");

            if (display_shield) {
                display_shield.style.display = "none";
            }
        }
        

}

////////////////////////////////////////////////////
//      Lock levels if player didn't complete it yet 
////////////////////////////////////////////////////

const player_email = sessionStorage.getItem("loggedInUserEmail");
const savedPlayer = localStorage.getItem(player_email);


if (savedPlayer) {
    const player = JSON.parse(savedPlayer);
    const completed_levels = player.completedLevels || []; // get completed levels

    // check if player completed level 1, if not display lock 
    const level_1_completed = completed_levels.includes(1);

    if (level_1_completed === false) {

        // get the lock and button
        const lock = document.getElementById("level2-lock");
        const button = document.getElementById("level2-button");

        lock.style.display = "block";
        button.textContent = "LOCKED";
        button.removeAttribute("href");
    }

     // check if player completed level 2, if not display lock 
    const level2Completed = completed_levels.includes(2);

    if (level2Completed === false) {
        const lock = document.getElementById("level3-lock");
        const button = document.getElementById("level3-button");

        lock.style.display = "block";
        button.textContent = "LOCKED";
        button.removeAttribute("href");
    }
}

// Reusable function to draw image on canvas once it is loaded sucessfully
export function drawLoadedImage(context, image, x, y, width, height) {
    if (image.complete && image.naturalWidth > 0) {
        context.drawImage(image, x, y, width, height);
    }
}

//////////////////////////////////////////////////////////
///      Reusable functions for level Collision Logic
//////////////////////////////////////////////////////////

// Check if FL1NK touches an item on the same deck   
export function touchesItem(player, x, width, deck) {
    if (player.currentDeck !== deck) {
        return false;
    }

    if (player.horizontal_position >= x + width) {
        return false;
    }

    if (player.horizontal_position + player.width <= x) {
        return false;
    }

    return true;
}


// Play the sound for an item
export function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Remove the hearts if fl1nk touched a collision
export function remove_heart(touched_now, touched_before) {
    if (touched_now) {
        if (!touched_before) {
            const hearts = document.querySelectorAll(".life-heart");
            const last_heart = hearts[hearts.length - 1]; // get last heart

            // remove heart at the end
            if (last_heart) {
                last_heart.remove();
            }
        }
    }

    return touched_now;
}