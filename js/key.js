
 // Load the key image
const key_image = new Image();
key_image.src = "assets/images/maze_key.png";

// Key size
let keyWidth = 90;
let keyHeight = 40;

// Key location
let keyDeck = 3;
let keyX = 0;
let keyY = 0;

// Check whether FL1NK has collected the key
let keyCollected = false;


// Draw the key on Deck 2
function draw_key() {

    // Do not draw the key after it is collected
    if (keyCollected || !key_image.complete || key_image.naturalWidth === 0) {
        return;
    }

    // Get Deck 2 information
    let key_deck_info = fl1nk_maze_design.decks[keyDeck];

    if (!key_deck_info) {
        return;
    }

    // Place key towards the left side of Deck 2
    keyX = key_deck_info.startPoint + 230;
    keyY = key_deck_info.y - keyHeight;

    // Draw the key
    context.drawImage(
        key_image,
        keyX,
        keyY,
        keyWidth,
        keyHeight
    );
}


// Check whether FL1NK collects the key
function check_key_collection() {

    // Stop if FL1NK is on another deck or already collected the key
    if (current_deck !== keyDeck || keyCollected) {
        return;
    }

    // Check if FL1NK touches the key
    if (flink_x < keyX + keyWidth &&
        flink_x + pirateWidth > keyX &&
        flink_y < keyY + keyHeight &&
        flink_y + pirateHeight > keyY) {

        // Mark key as collected
        keyCollected = true;

        // Update key status on the screen
        document.querySelector(".key-status-image").style.display = "none";
        document.querySelector(".key-collected-tick").style.display = "block";
    }
}
