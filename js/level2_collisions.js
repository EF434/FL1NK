///////////////////////////////////////////////////
///             Level 2 Game Collisions
//////////////////////////////////////////////////

// import the KeyTreasure, Shield class and helper functions
import { KeyTreasure, Shield, remove_heart, touchesItem  } from "./levels_game_elements.js";

// store the positions of the 3 obstacles on ship
const ship_obstacles = [
    { x: 1015, y: 765, width: 35, deck: 2 },
    { x: 505, y: 495, width: 35, deck: 4 },
    { x: 1030, y: 495, width: 80, deck: 4 }
];

let fl1nk_touched_obstcale = false;

// Key position and dimentions
const keyX = 980;
const keyDeck = 2;
const keyWidth = 70;
const keyHeight = 75;

// Treasure position and dimentions
const treasureX = 350;
const treasureDeck = 5;
const treasureWidth = 90;
const treasureHeight = 85;

// Create key and treasure for Level 2
const level2KeyTreasure = new KeyTreasure(
    //  pass the key
    {
        image: "../assets/images/level2_key.png",
        x: keyX,
        deck: keyDeck,
        width: keyWidth,
        height: keyHeight
    },
    // pass the treasure
    {
        treasure_closed_img: "../assets/images/treasure_locked_2.png",
        treasure_open_img: "../assets/images/treasure-open2.png",
        x: treasureX,
        deck: treasureDeck,
        width: treasureWidth,
        height: treasureHeight
    }
);

// create the shield for level 2
const level2Shield = new Shield("../assets/images/shield.png",220,3);



// Check all the level 2 collisions
export function check_level_2_collisions(player, previousX, pirate) {
    let touched_hazard_now = false;

    // Check shield collection
    level2Shield.checkCollision(player);

    // Stop FL1NK from crossing the spiked ball without the shield
    const spike = ship_obstacles[0];

    // stop fl1nk from crossing the spike if they don't have the shield
    if (player.currentDeck === 2) {
        if (!player.climbing) {
            if (!level2Shield.shield_active) {
                if (!level2KeyTreasure.collected_key) {

                    // stop fl1nk from moving foward
                    if (previousX + player.width <= spike.x) {
                        if (player.horizontal_position + player.width > spike.x) {
                            player.horizontal_position = spike.x - player.width;
                        }
                    }

                }
            }
        }
    }

    if (!player.climbing) {
        // check if fl1nk touched the pther obstacles
        for (let i = 1; i < ship_obstacles.length; i++) {
            const obstacle = ship_obstacles[i];

            if (touchesItem(player, obstacle.x, obstacle.width, obstacle.deck)) {
                touched_hazard_now = true;
                break;
            }
        }

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
            }
        }
    }

    // If the player collected shiled than can get key and treasure
    let can_get_Key_Treasure = false;

    if (level2Shield.shield_active) {
        can_get_Key_Treasure = true;
    }

    if (level2KeyTreasure.collected_key) {
        can_get_Key_Treasure = true;
    }

    if (can_get_Key_Treasure) {
        level2KeyTreasure.checkCollision(player);
    }

    // Deactivate shield protection when key collected
    if (level2KeyTreasure.collected_key) {
        if (level2Shield.shield_active) {
            level2Shield.stop();
        }
    }

    // remove heart if touched obstacle
    fl1nk_touched_obstcale = remove_heart(
        touched_hazard_now,
        fl1nk_touched_obstcale
    );
}


// Draw Level 2 key, treasure & shield
export function draw_level_2_collisions(context, decks) {

    level2KeyTreasure.draw(context, decks);
    level2Shield.draw(context, decks);
}

// Return true, when treasure unlocked
export function level_2_completed() {
    return level2KeyTreasure.unlocked_treasure;
}