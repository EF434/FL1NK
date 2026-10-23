// Load both poison images
const poisonImage1 = new Image();
poisonImage1.src = "assets/images/poison_1.png";

const poisonImage2 = new Image();
poisonImage2.src = "assets/images/poison_2.png";

const poisonWidth = 100;
const poisonHeight = 70;

// Set each poison's x position and deck number
const poison_one = 560;
const poison_deck1 = 3;

const poison_two = 700;
const poison_deck2 = 4;

// Tracks contact so a heart is removed only once per touch
let fl1nk_touched_poision = false;

// Draw both poison puddles on their decks
export function drawLevel1Collisions(context, decks) {
    const deck1 = decks[poison_deck1];
    const deck2 = decks[poison_deck2];

    if (!deck1 || !deck2) {
        return;
    }

    if (poisonImage1.complete && poisonImage1.naturalWidth > 0) {
        context.drawImage(
            poisonImage1,
            poison_one,
            deck1.y - poisonHeight,
            poisonWidth,
            poisonHeight
        );
    }

    if (poisonImage2.complete && poisonImage2.naturalWidth > 0) {
        context.drawImage(
            poisonImage2,
            poison_two,
            deck2.y - poisonHeight,
            poisonWidth,
            poisonHeight
        );
    }
}

// Return true when FL1NK is on this deck and overlaps the poison horizontally
function touchingPoison(player, x, deck) {
    return player.currentDeck === deck &&
        player.xPos < x + poisonWidth &&
        player.xPos + player.width > x;
}

// Check poison contact and remove one heart on first contact
export function checkLevel1Collisions(player) {
    let touchingNow = false;

    // Poison does not affect FL1NK while climbing
    if (!player.climbing) {
        touchingNow =
            touchingPoison(player, poison_one, poison_deck1) ||
            touchingPoison(player, poison_two, poison_deck2);
    }

    // Remove one heart when FL1NK first touches poison
    if (touchingNow && !fl1nk_touched_poision) {
        const hearts = document.querySelectorAll(".life-heart");
        const lastHeart = hearts[hearts.length - 1];

        if (lastHeart) {
            lastHeart.remove();
        }
    }

    // FL1NK must leave the poison before another heart can be removed
    fl1nk_touched_poision = touchingNow;
}