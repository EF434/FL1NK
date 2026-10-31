"use strict";
///////////////////////////////////////////////////
///             Level 3 Game Collisions
//////////////////////////////////////////////////

// import the helper functions
import {drawLoadedImage,touchesItem, playSound, remove_heart} from "./levels_game_elements.js";

//Load all the images for the game
const poisonImage = new Image();
poisonImage.src = "../assets/images/poison_2.png";

const mapImage = new Image();
mapImage.src = "../assets/images/map.png";

const keyImage = new Image();
keyImage.src = "../assets/images/key3.png";

const chestImage = new Image();
chestImage.src = "../assets/images/chest.png";

const openTreasureImage = new Image();
openTreasureImage.src = "../assets/images/open_chest.png";

const openEmptyImage = new Image();
openEmptyImage.src = "../assets/images/empty_open_chest.png";

const leftHintImage = new Image();
leftHintImage.src = "../assets/images/left_treasure_hint.png";

const rightHintImage = new Image();
rightHintImage.src = "../assets/images/right_treasure_hint.png";

// Game sound affects
const mapSound = new Audio("../assets/sounds/map.mp3");
const keySound = new Audio("../assets/sounds/key.mp3");
const chestSound = new Audio("../assets/sounds/treasure.mp3");
const poisonSound = new Audio("../assets/sounds/poison.mp3");
const pirateSound = new Audio("../assets/sounds/poison.mp3");

// poison dimentions
const poisonWidth = 65;
const poisonHeight = 65;

// poison bottles positions
const poisons = [
    { x: 535, deck: 2 },
    { x: 715, deck: 4 },
    { x: 610, deck: 7 }
];

// Map position and dimentions
const mapX = 350;
const mapDeck = 4;
const mapWidth = 85;
const mapHeight = 65;

// Key position and dimentions
const keyX = 720;
const keyDeck = 5;
const keyWidth = 80;
const keyHeight = 45;

// Treasure  size and dimentions
const chestWidth = 100;
const chestHeight = 75;

// treasure bottles positions
const chests = [
    { x: 350, deck: 7, opened: false },
    { x: 1010, deck: 7, opened: false }
];

// Map and key status
let hasMap = false;
let hasKey = false;

// randomly make a chest the real chest
const realChest = Math.floor(Math.random() * chests.length);

// game status checks
let level3Complete = false;
let show_hint_map = false;
let fl1nk_touched_poison = false;
let fl1nk_touched_hazard = false;
let fl1nk_touched_pirate = false;

// Draw items on their decks
export function draw_level_3_collisions(context, decks) {

    // Get poison bottles and draw them
    for (let i = 0; i < poisons.length; i++) {
        const poison = poisons[i];
        const deck = decks[poison.deck];

        // draw poison image on deck
        if (deck) {
            drawLoadedImage(
                context, poisonImage,
                poison.x, deck.y - poisonHeight,
                poisonWidth, poisonHeight
            );
        }
    }

    // Draw map until it's collected by player
    if (!hasMap) {
        const map_deck = decks[mapDeck];

        if (map_deck) {
            drawLoadedImage(
                context,
                mapImage,mapX,
                map_deck.y - mapHeight,
                mapWidth,mapHeight
            );
        }
    }

    // Draw key until it's collected by player
    if (!hasKey) {
        const key_deck = decks[keyDeck];

        if (key_deck) {
            drawLoadedImage(
                context,
                keyImage, keyX,
                key_deck.y - keyHeight,
                keyWidth, keyHeight
            );
        }
    }

    // Draw treasure chests
    for (let i = 0; i < chests.length; i++) {
        // get the chest
        const chest = chests[i];
        const chest_deck = decks[chest.deck];

        if (chest_deck) {
            let image = chestImage;

            // display image based on status
            if (chest.opened) {
                image = openEmptyImage;

                if (i === realChest) {
                    image = openTreasureImage;
                }
            }

            // draw the image
            drawLoadedImage(
                context,
                image,
                chest.x,
                chest_deck.y - chestHeight,
                chestWidth,
                chestHeight
            );
        }
    }
}



// Check Level 3 collisions
export function check_level_3_collisions(player, pirates) {
    let touched_poison_now = false;
    let touched_hazard_now = false;
    let touched_pirate_now = false;


    // check if fl1nk touched a poison bottle
    if (!player.climbing) {
        for (let i = 0; i < poisons.length; i++) {
            const poison = poisons[i];

            if (touchesItem(player, poison.x, poisonWidth, poison.deck)) {
                touched_poison_now = true;
                 touched_hazard_now = true;
                break;
            }
        }

        // check if fl1nk touched pirate
        for (const pirate of pirates) {
            if (player.currentDeck === pirate.pirateDeck) {
                // create a small collision area around the pirate
                const pirateCollision = {
                    x: pirate.pirateX + 15,
                    y: pirate.pirateY + 10,
                    width: pirate.pirateWidth - 30,
                    height: pirate.pirateHeight - 20
                };

                // if pirate and fl1nk touch, collision happned
                if (
                    touchesItem(
                        player,
                        pirateCollision.x,
                        pirateCollision.width,
                        pirate.pirateDeck
                    )
                ) {
                    touched_hazard_now = true;
                    touched_pirate_now = true;

                    if (!fl1nk_touched_pirate) {
                        playSound(pirateSound);
                    }

                }
            }
        }

        // Collect the map
        if (!hasMap) {

            // play sound when map touched
            if (touchesItem(player, mapX, mapWidth, mapDeck)) {
                hasMap = true;
                playSound(mapSound);

                // show the hint
                show_hint_map = true;
                let hint_seconds_remaining = 3;
                let map_hint_timer;

                // hide the hint after timer over
                map_hint_timer = setInterval(() => {
                    hint_seconds_remaining--;

                    if (hint_seconds_remaining <= 0) {
                        show_hint_map = false;
                        clearInterval(map_hint_timer);
                    }
                }, 1000);

                // tick the checkbox
                const mapTick = document.getElementById("map-tick");

                if (mapTick) {
                    mapTick.style.display = "block";
                }
            }
        }

        // collected the key
        if (!hasKey) {
            // play the sound
            if (touchesItem(player, keyX, keyWidth, keyDeck)) {
                hasKey = true;
                playSound(keySound);

                // tick the checkbox
                const keyTick = document.getElementById("key-tick");

                if (keyTick) {
                    keyTick.style.display = "block";
                }
            }
        }

        // open chest once key collected
        if (hasKey) {
            if (!level3Complete) {
                for (let i = 0; i < chests.length; i++) {
                    const chest = chests[i];

                    if (!chest.opened) {
                        if (touchesItem(player, chest.x, chestWidth, chest.deck)) {
                            chest.opened = true;
                            playSound(chestSound);

                            // level completed
                            if (i === realChest) {
                                level3Complete = true;
                            }
                        }
                    }
                }
            }
        }
    }

    fl1nk_touched_pirate = touched_pirate_now;
    // play sound
    if (touched_poison_now) {
        if (!fl1nk_touched_poison) {
            playSound(poisonSound);
        }
    }

    // remember if fl1nk touched poision
    fl1nk_touched_poison = touched_poison_now;

    // Remove a heart on first poison contact
    fl1nk_touched_hazard = remove_heart(
        touched_hazard_now,
        fl1nk_touched_hazard
    );
}


// Draw the treasure map hint image
export function drawMapHint(context) {
    if (!show_hint_map) {
        return;
    }

    // set chest by default in case
    let hintImage = rightHintImage;

    // show the hint randomly based onreal chest
    if (realChest === 0) {
        hintImage = leftHintImage;
    }

    // display the image
    drawLoadedImage(context, hintImage, 200, 125, 1000, 650);
}


// Return true, when treasure unlocked
export function level_3_completed() {
    return level3Complete;
}