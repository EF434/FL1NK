
 // Load both treasure images
const treasureLockedImage = new Image();
treasureLockedImage.src = "assets/images/treasure-locked.png";

const treasureOpenImage = new Image();
treasureOpenImage.src = "assets/images/treasure-open.png";

// Treasure size and position
let treasureWidth = 85;
let treasureHeight = 85;
let treasureX = 300;
let treasureY = 0;

// Captain's deck
let treasureDeck = 5;

// Check whether treasure is opened
let treasureOpened = false;


// Draw the treasure
function draw_treasure() {

    // Get the captain's deck information
    let treasure_deck_info = fl1nk_maze_design.decks[treasureDeck];

    if (!treasure_deck_info) {
        return;
    }

    // Position treasure on captain's deck
    treasureY = treasure_deck_info.y - treasureHeight + 10;

    // Choose which treasure image to display
    let treasureImage = treasureLockedImage;

    if (treasureOpened) {
        treasureImage = treasureOpenImage;
    }

    // Check whether the image is loaded
    if (!treasureImage.complete || treasureImage.naturalWidth === 0) {
        return;
    }

    // Draw the treasure
    context.drawImage(
        treasureImage,
        treasureX,
        treasureY,
        treasureWidth,
        treasureHeight
    );
}


// Check whether FL1NK can open the treasure
function check_treasure_collection() {

    // Stop if on another deck or treasure already opened
    if (current_deck !== treasureDeck || treasureOpened) {
        return;
    }

    // Check whether FL1NK touches the treasure
    const touchesTreasure =
        flink_x < treasureX + treasureWidth &&
        flink_x + pirateWidth > treasureX &&
        flink_y < treasureY + treasureHeight &&
        flink_y + pirateHeight > treasureY;

    // Open treasure only when FL1NK has the key
    if (touchesTreasure && keyCollected) {

        treasureOpened = true;

        console.log("Treasure opened! FL1NK wins!");
    }
}
