
"use strict";

// Load the poison bottle image
const poisonImage = new Image();
poisonImage.src = "assets/images/poison_2.png";

// Poison bottle size
const poisonWidth = 65;
const poisonHeight = 65;

// Poison bottle positions
const poison_one = 535;
const poison_deck1 = 2;

const poison_two = 715;
const poison_deck2 = 4;

const poison_three = 610;
const poison_deck3 = 7;

// Store all poison bottle positions
const poisons = [
    { x: poison_one, deck: poison_deck1 },
    { x: poison_two, deck: poison_deck2 },
    { x: poison_three, deck: poison_deck3 }
];

// Check whether FL1NK is touching poison
let fl1nkTouchedPoison = false;


// Draw poison bottles on Level 3
export function drawLevel3Collisions(context, decks) {

    // Check whether the poison image has loaded
    if (!poisonImage.complete || poisonImage.naturalWidth === 0) {
        return;
    }

    // Draw each poison bottle using the same image
    for (const poison of poisons) {

        const deck = decks[poison.deck];

        if (deck) {

            context.drawImage(
                poisonImage,
                poison.x,
                deck.y - poisonHeight,
                poisonWidth,
                poisonHeight
            );
        }
    }
}


// Check whether FL1NK touches a poison bottle
export function checkLevel3Collisions(player) {

    let touchingPoisonNow = false;

    // Check collisions only when FL1NK is not climbing
    if (!player.climbing) {

        for (const poison of poisons) {

            if (
                player.currentDeck === poison.deck &&
                player.xPos < poison.x + poisonWidth &&
                player.xPos + player.width > poison.x
            ) {
                touchingPoisonNow = true;
                break;
            }
        }
    }

    // Remove one heart when FL1NK first touches poison
    if (touchingPoisonNow && !fl1nkTouchedPoison) {

        const hearts = document.querySelectorAll(".life-heart");
        const lastHeart = hearts[hearts.length - 1];

        if (lastHeart) {
            lastHeart.remove();
        }
    }

    // FL1NK must leave poison before losing another heart
    fl1nkTouchedPoison = touchingPoisonNow;
}
