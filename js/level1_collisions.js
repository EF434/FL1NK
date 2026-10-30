import { KeyTreasure } from "./levels_game_elements.js";

// Sounds
const keySound = new Audio("../assets/sounds/key.mp3");
const poisonSound = new Audio("../assets/sounds/poison.mp3");

// Poison images
const poisonImage1 = new Image();
poisonImage1.src = "../assets/images/poison_1.png";

const poisonImage2 = new Image();
poisonImage2.src = "../assets/images/poison_2.png";

// Poison size and positions
const poisonWidth = 100;
const poisonHeight = 70;

const poison_one = 560;
const poison_deck1 = 3;

const poison_two = 700;
const poison_deck2 = 4;

// Key position and size
const keyX = 650;
const keyDeck = 4;
const keyWidth = 90;
const keyHeight = 40;

// Treasure position and size
const treasureX = 300;
const treasureDeck = 5;
const treasureWidth = 90;
const treasureHeight = 70;

let fl1nk_touched_poision = false;

// Create key and treasure for Level 1
const level1KeyTreasure = new KeyTreasure(
    "../assets/images/level1_key.png",
    "../assets/images/treasure-locked1.png",
    "../assets/images/treasure-open1.png",
    keyX, keyDeck, keyWidth, keyHeight,
    treasureX, treasureDeck, treasureWidth, treasureHeight
);

// Draw an image only after it has loaded successfully
function drawLoadedImage(context, image, x, y, width, height) {
    if (image.complete && image.naturalWidth > 0) {
        context.drawImage(image, x, y, width, height);
    }
}

// Play a sound from the beginning
function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {
        // The game continues if the browser blocks audio.
    });
}

// Draw poisons, key, and treasure on their decks
export function drawLevel1Collisions(context, decks) {
    const poisonDeck1 = decks[poison_deck1];
    const poisonDeck2 = decks[poison_deck2];

    if (poisonDeck1) {
        drawLoadedImage(
            context,
            poisonImage1,
            poison_one,
            poisonDeck1.y - poisonHeight + 10,
            poisonWidth,
            poisonHeight
        );
    }

    if (poisonDeck2) {
        drawLoadedImage(
            context,
            poisonImage2,
            poison_two,
            poisonDeck2.y - poisonHeight + 10,
            poisonWidth,
            poisonHeight
        );
    }

    // Draw Level 1 key and treasure
    level1KeyTreasure.draw(context, decks);
}

// Check whether FL1NK is on a deck and overlaps an item horizontally
function touchesItem(player, x, width, deck) {
    return player.currentDeck === deck &&
        player.xPos < x + width &&
        player.xPos + player.width > x;
}

// Check poison, key, and treasure interactions
export function checkLevel1Collisions(player) {
    let touchingPoisonNow = false;

    if (!player.climbing) {
        touchingPoisonNow =
            touchesItem(player, poison_one, poisonWidth, poison_deck1) ||
            touchesItem(player, poison_two, poisonWidth, poison_deck2);
    }

    // Remember whether FL1NK already has the key
    const hadKeyBefore = level1KeyTreasure.hasKey;

    // Check key collection and treasure opening
    level1KeyTreasure.checkCollision(player);

    // Play the key sound only when the key is newly collected
    if (!hadKeyBefore && level1KeyTreasure.hasKey) {
        playSound(keySound);
    }

    // Remove one heart and play a sound on first poison contact
    if (touchingPoisonNow && !fl1nk_touched_poision) {
        const hearts = document.querySelectorAll(".life-heart");
        const lastHeart = hearts[hearts.length - 1];

        if (lastHeart) {
            lastHeart.remove();
        }

        playSound(poisonSound);
    }

    // FL1NK must leave the poison before another heart can be removed
    fl1nk_touched_poision = touchingPoisonNow;
}


// ============== CHECK LEVEL 1 VICTORY ==============

// Return true when FL1NK has unlocked the treasure
export function isLevel1Complete() {
    return level1KeyTreasure.treasureIsOpen;
}