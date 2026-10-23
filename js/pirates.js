// Load the enemy pirate sprite sheet
const pirate_sprite_sheet = new Image();

pirate_sprite_sheet.src = "assets/images/pirate-sprite-sheet.png";

// Store animation information
let pirate_current_frame = 0;
let pirate_frame_counter = 0;


// Enemy pirate position
let pirateX = 300;
let pirateY = 0;

// Enemy pirate size
const pirateWidth = 90;
const pirateHeight = 95;

// Pirate movement
let pirateSpeed = 2;
let pirateDirection = 1;

// Deck where the pirate patrols
let pirateDeck = 3;



function move_pirate() {

    // Get the information for Deck 3
    let pirate_deck_info = fl1nk_maze_design.decks[pirateDeck];

    // Position the pirate on the deck
    pirateY = pirate_deck_info.y - pirateHeight;

    // Move the pirate automatically
    pirateX += pirateSpeed * pirateDirection;

    // Turn left at the right boundary
    if (pirateX + pirateWidth >= pirate_deck_info.endPoint) {
        pirateDirection = -1;
    }

    // Turn right at the left boundary
    if (pirateX <= pirate_deck_info.startPoint) {
        pirateDirection = 1;
    }

    // Reuse the boundary function from player.js
    pirateX = player_maze_limits(pirateX, pirateWidth, pirateDeck);
}



function draw_pirate() {

    if (!pirate_sprite_sheet.complete) {
        return;
    }

    pirate_frame_counter++;

    if (pirate_frame_counter >= 8) {
        pirate_current_frame++;
        pirate_frame_counter = 0;
    }

    if (pirate_current_frame >= 4) {
        pirate_current_frame = 0;
    }

    let frame_width = pirate_sprite_sheet.width / 4;
    let frame_height = pirate_sprite_sheet.height / 2;

    let source_x = pirate_current_frame * frame_width;
    let source_y = 0;

    // top row = right
    if (pirateDirection === 1) {
        source_y = 0;
    }

    // bottom row = left
    if (pirateDirection === -1) {
        source_y = frame_height;
    }

    context.drawImage(
        pirate_sprite_sheet,
        source_x,
        source_y,
        frame_width,
        frame_height,
        pirateX,
        pirateY,
        pirateWidth,
        pirateHeight
    );
}