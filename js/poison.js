// Load the poison image
const poisonImage = new Image();
poisonImage.src = "assets/images/poison.png";

// Poison size and position
let poisonWidth = 65;
let poisonHeight = 65;
let poisonX = 200;
let poisonY = 200;

// Choose which deck contains the poison
let poisonDeck = 4;
let touchingPoison = false;


// Draw the poison
function draw_poison() {

    // Check whether the image has loaded
    if (!poisonImage.complete || poisonImage.naturalWidth === 0) {
        return;
    }

    // Get the selected deck information
    let poison_deck_info = fl1nk_maze_design.decks[poisonDeck];

    if (!poison_deck_info) {
        return;
    }

    // Position the poison on the selected deck
    poisonY = poison_deck_info.y - poisonHeight + 10;

    // Draw the poison image
    context.drawImage(
        poisonImage,
        poisonX,
        poisonY,
        poisonWidth,
        poisonHeight
    );
}


// Check whether FL1NK touches the poison
function check_poison_collision() {

    // Only check collision on the correct deck
    if (current_deck !== poisonDeck) {
        touchingPoison = false;
        return;
    }

    // Check whether FL1NK touches the poison
    const touchesPoison =
        flink_x < poisonX + poisonWidth &&
        flink_x + pirateWidth > poisonX &&
        flink_y < poisonY + poisonHeight &&
        flink_y + pirateHeight > poisonY;

    // Player touches poison for the first time
    if (touchesPoison && !touchingPoison) {

        // Remove one heart
        const hearts = document.querySelectorAll(".life-heart");

        if (hearts.length > 0) {
            hearts[hearts.length - 1].remove();
        }
    }

    // Remember whether FL1NK is touching the poison
    touchingPoison = touchesPoison;
}