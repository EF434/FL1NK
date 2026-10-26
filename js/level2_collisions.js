import { get_pirate_position } from "./pirate.js";
import { KeyTreasure } from "./key_treasure.js";
import { Shield } from "./shield.js";

const level2Obstacles = [
    { x: 1015, y: 765, width: 35, height: 40 },
    { x: 505, y: 495, width: 35, height: 40 },
    { x: 1030, y: 495, width: 80, height: 55 }
];

let fl1nkTouchedObstacle = false;

// Key position and size
const keyX = 980;
const keyDeck = 2;
const keyWidth = 70;
const keyHeight = 75;

// Treasure position and size
const treasureX = 350;
const treasureDeck = 5;
const treasureWidth = 90;
const treasureHeight = 85;

// Create key and treasure for Level 2
const level2KeyTreasure = new KeyTreasure(
    "assets/images/level2_key.png",
    "assets/images/treasure_locked_2.png",
    "assets/images/treasure-open2.png",
    keyX, keyDeck, keyWidth, keyHeight,
    treasureX, treasureDeck, treasureWidth, treasureHeight
);

// Create shield for Level 2 on the left side of Deck 3
const level2Shield = new Shield(
    "assets/images/shield.png",
    220, 3
);

// Check whether FL1NK touches an obstacle
function touchesObstacle(player, obstacle) {

    // Smaller collision area for FL1NK
    const playerX = player.xPos + 25;
    const playerY = player.yPos + 20;
    const playerWidth = player.width - 50;
    const playerHeight = player.height - 30;

    return (
        playerX < obstacle.x + obstacle.width &&
        playerX + playerWidth > obstacle.x &&
        playerY < obstacle.y + obstacle.height &&
        playerY + playerHeight > obstacle.y
    );
}

// Check Level 2 collisions
export function checkLevel2Collisions(player, previousX) {

    let touchingObstacleNow = false;

    // Check shield collection
    level2Shield.checkCollision(player);

    // Stop FL1NK from crossing the spiked ball without the shield
    const spike = level2Obstacles[0];

    if (
        player.currentDeck === 2 &&
        !player.climbing &&
        !level2Shield.isActive() &&
        !level2KeyTreasure.hasKey
    ) {

        // Stop FL1NK when approaching from the left
        if (
            previousX + player.width <= spike.x &&
            player.xPos + player.width > spike.x
        ) {
            player.xPos = spike.x - player.width;
        }

        // Stop FL1NK when approaching from the right
        if (
            previousX >= spike.x + spike.width &&
            player.xPos < spike.x + spike.width
        ) {
            player.xPos = spike.x + spike.width;
        }

        // Prevent FL1NK from remaining inside the spike
        if (
            player.xPos < spike.x + spike.width &&
            player.xPos + player.width > spike.x
        ) {
            if (previousX + player.width / 2 < spike.x + spike.width / 2) {
                player.xPos = spike.x - player.width;
            } else {
                player.xPos = spike.x + spike.width;
            }
        }
    }

    if (!player.climbing) {

        for (const obstacle of level2Obstacles) {

            // Shield protects only against the Deck 2 spiked ball
            if (obstacle === level2Obstacles[0]) {
                // The spiked ball blocks movement instead of removing hearts
                continue;
            }

            if (touchesObstacle(player, obstacle)) {
                touchingObstacleNow = true;
                break;
            }
        }

        // Check whether FL1NK touches the pirate on Deck 3
        const pirate = get_pirate_position();

        if (player.currentDeck === pirate.deck) {

            // Smaller collision area for the pirate
            const pirateCollision = {
                x: pirate.x + 15,
                y: pirate.y + 10,
                width: pirate.width - 30,
                height: pirate.height - 20
            };

            if (touchesObstacle(player, pirateCollision)) {
                touchingObstacleNow = true;
            }
        }
    }

    // Check Level 2 key and treasure
    // FL1NK must have active shield protection to collect the key
    if (
        level2KeyTreasure.hasKey ||
        level2Shield.isActive()
    ) {
        level2KeyTreasure.checkCollision(player);
    }

    // Stop shield protection when the key is collected
    if (level2KeyTreasure.hasKey && level2Shield.shieldActive) {
        level2Shield.stop();
    }

    if (touchingObstacleNow && !fl1nkTouchedObstacle) {

        const hearts = document.querySelectorAll(".life-heart");
        const lastHeart = hearts[hearts.length - 1];

        if (lastHeart) {
            lastHeart.remove();
        }
    }

    fl1nkTouchedObstacle = touchingObstacleNow;
}

// Draw Level 2 key and treasure
export function drawLevel2Collisions(context, decks) {
    level2KeyTreasure.draw(context, decks);

    // Draw the shield and countdown
    level2Shield.draw(context, decks);
}


// ============== CHECK LEVEL 2 VICTORY ==============

// Return true when FL1NK has unlocked the Level 2 treasure
export function isLevel2Complete() {
    return level2KeyTreasure.treasureIsOpen;
}