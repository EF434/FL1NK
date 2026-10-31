///////////////////////////////////////////////////
///             Level 1 Game Collisions
//////////////////////////////////////////////////

// import the KeyTreasure class
import { KeyTreasure, drawLoadedImage, touchesItem, playSound, remove_heart  } from "./levels_game_elements.js";

// get the posion sound
const poisonSound = new Audio("../assets/sounds/poison.mp3");

// set the posision images for decks
const poisonImage1 = new Image();
poisonImage1.src = "../assets/images/poison_1.png";

const poisonImage2 = new Image();
poisonImage2.src = "../assets/images/poison_2.png";

// set posision size and dimentions 
const poisonWidth = 100;
const poisonHeight = 70;

const poison_one = 560;
const poison_deck1 = 3;

const poison_two = 700;
const poison_deck2 = 4;

// Set key dimention and position
const keyX = 650;
const keyDeck = 4;
const keyWidth = 90;
const keyHeight = 40;

// Set Treasure dimention and position
const treasureX = 300;
const treasureDeck = 5;
const treasureWidth = 90;
const treasureHeight = 70;

let fl1nk_touched_poision = false;

// create key and treasure using the class
const level1KeyTreasure = new KeyTreasure(

    //  pass the key
    {
        image: "../assets/images/level1_key.png",
         x: keyX,deck: keyDeck,width: keyWidth,height: keyHeight
    },
    // pass the treasure
    {
        treasure_closed_img: "../assets/images/treasure-locked1.png",
        treasure_open_img: "../assets/images/treasure-open1.png",
        x: treasureX,deck: treasureDeck,
        width: treasureWidth,height: treasureHeight
    }
);


// Draw poison, key and treasure on relavent decks
export function draw_level_1_collisions(context, decks) {
    // get the positions of posion
    const poisonDeck1 = decks[poison_deck1];
    const poisonDeck2 = decks[poison_deck2];

    // draw posion on deck 1 
    if (poisonDeck1) {
        drawLoadedImage(
            context,
            poisonImage1, poison_one,
            poisonDeck1.y - poisonHeight + 10,
            poisonWidth,poisonHeight
        );
    }

    // draw posion on deck 2
    if (poisonDeck2) {
        drawLoadedImage(
            context,
            poisonImage2, poison_two,
            poisonDeck2.y - poisonHeight + 10,
            poisonWidth, poisonHeight
        );
    }

    // draw treasure and key
    level1KeyTreasure.draw(context, decks);
}



// Check poison, key, and treasure interactions
export function check_level_1_collisions(player) {
    let touched_poison = false;

    // if player is not climbing, check they touched the poison bottle
    if (!player.climbing) {
        if (touchesItem(player, poison_one, poisonWidth, poison_deck1)) {
            touched_poison = true;
        }

        if (touchesItem(player, poison_two, poisonWidth, poison_deck2)) {
            touched_poison = true;
        }
    }

    // check if key is collected, and treasure unlocked
    level1KeyTreasure.checkCollision(player);

    // play sound when touching it first
    if (touchingPoisonNow && !fl1nk_touched_poision) {
            playSound(poisonSound);
        }

    // Remove one heart on first poison contact
    fl1nk_touched_poision = remove_heart(touchingPoisonNow, fl1nk_touched_poision);
}



// Return true, when treasure unlocked
export function level_1_completed() {
    return level1KeyTreasure.unlocked_treasure;
}