
"use strict";

// Load images
const poisonImage = new Image();
poisonImage.src = "../assets/images/poison_2.png";

const mapImage = new Image();
mapImage.src = "../assets/images/map.png";

const keyImage = new Image();
keyImage.src = "../assets/images/key3.png";

const chestImage = new Image();
chestImage.src = "../assets/images/chest.png";

// Load open treasure chest images
const openTreasureImage = new Image();
openTreasureImage.src = "../assets/images/open_chest.png";

const openEmptyImage = new Image();
openEmptyImage.src = "../assets/images/empty_open_chest.png";

// Load treasure map hint images
const leftHintImage = new Image();
leftHintImage.src = "../assets/images/left_treasure_hint.png";

const rightHintImage = new Image();
rightHintImage.src = "../assets/images/right_treasure_hint.png";

// Map collection sound
const mapSound = new Audio("../assets/sounds/key.mp3");

// Key collection sound
const keySound = new Audio("assets/sounds/key.mp3");

// Poison bottle size
const poisonWidth = 65;
const poisonHeight = 65;

// Poison bottle positions
const poisons = [
    { x: 535, deck: 2 },
    { x: 715, deck: 4 },
    { x: 610, deck: 7 }
];

// Map position and size
const mapX = 350;
const mapDeck = 4;
const mapWidth = 85;
const mapHeight = 65;

// Key position and size
const keyX = 720;
const keyDeck = 5;
const keyWidth = 80;
const keyHeight = 45;

// Treasure chest positions and size
const chestWidth = 100;
const chestHeight = 75;

const chests = [
    { x: 350, deck: 7, opened: false },
    { x: 1010, deck: 7, opened: false }
];

// Map collection status
let hasMap = false;

// Key collection status
let hasKey = false;

// Randomly select the real treasure chest
// 0 = left chest, 1 = right chest
let realChest = Math.floor(Math.random() * 2);

// Level completion status
let level3Complete = false;

// Treasure map hint settings
let showMapHint = false;
let mapHintStartTime = 0;
const mapHintDuration = 5000;

// Check whether FL1NK is touching poison
let fl1nkTouchedPoison = false;


// Draw items on their decks
export function drawLevel3Collisions(context, decks) {

    // Draw poison bottles
    if (poisonImage.complete && poisonImage.naturalWidth > 0) {

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

    // Draw map only if FL1NK has not collected it
    if (
        !hasMap &&
        mapImage.complete &&
        mapImage.naturalWidth > 0
    ) {
        context.drawImage(
            mapImage,
            mapX,
            decks[mapDeck].y - mapHeight,
            mapWidth,
            mapHeight
        );
    }

    // Draw key on Deck 5
    if (
        !hasKey &&
        keyImage.complete &&
        keyImage.naturalWidth > 0
    ) {
        context.drawImage(
            keyImage,
            keyX,
            decks[keyDeck].y - keyHeight,
            keyWidth,
            keyHeight
        );
    }

    // Draw treasure chests
    for (let i = 0; i < chests.length; i++) {

        const chest = chests[i];

        // Closed chest by default
        let currentChestImage = chestImage;

        // Select the correct open chest image
        if (chest.opened) {

            if (i === realChest) {
                currentChestImage = openTreasureImage;
            } else {
                currentChestImage = openEmptyImage;
            }
        }

        // Draw chest when its image has loaded
        if (
            currentChestImage.complete &&
            currentChestImage.naturalWidth > 0
        ) {
            context.drawImage(
                currentChestImage,
                chest.x,
                decks[chest.deck].y - chestHeight,
                chestWidth,
                chestHeight
            );
        }
    }
}


// Check whether FL1NK touches an item
function touchesItem(player, x, width, deck) {

    return player.currentDeck === deck &&
        player.xPos < x + width &&
        player.xPos + player.width > x;
}


// Check Level 3 collisions
export function checkLevel3Collisions(player) {

    let touchingPoisonNow = false;

    // Check collisions only when FL1NK is not climbing
    if (!player.climbing) {

        // Check poison collisions
        for (const poison of poisons) {

            if (
                touchesItem(
                    player,
                    poison.x,
                    poisonWidth,
                    poison.deck
                )
            ) {
                touchingPoisonNow = true;
                break;
            }
        }

        // Check whether FL1NK collects the map
        if (
            !hasMap &&
            touchesItem(player, mapX, mapWidth, mapDeck)
        ) {

            hasMap = true;

            // Play map collection sound
            mapSound.currentTime = 0;
            mapSound.play().catch(() => {
                // Continue if the browser blocks audio
            });

            // Show the correct treasure map hint
            showMapHint = true;
            mapHintStartTime = Date.now();

            // Show green tick for collected map
            document.getElementById("map-tick").style.display = "block";

            console.log("Treasure map collected!");
        }

        // Check whether FL1NK collects the key
        if (
            !hasKey &&
            touchesItem(player, keyX, keyWidth, keyDeck)
        ) {

            hasKey = true;

            // Play key collection sound
            keySound.currentTime = 0;
            keySound.play().catch(() => {
                // Continue if the browser blocks audio
            });

            // Show green tick for collected key
            document.getElementById("key-tick").style.display = "block";

            console.log("Level 3 key collected!");
        }

        // Check treasure chest collisions
        if (hasKey && !level3Complete) {

            for (let i = 0; i < chests.length; i++) {

                const chest = chests[i];

                // Open a chest only once
                if (
                    !chest.opened &&
                    touchesItem(
                        player,
                        chest.x,
                        chestWidth,
                        chest.deck
                    )
                ) {

                    chest.opened = true;

                    // Check if FL1NK found the real treasure
                    if (i === realChest) {

                        level3Complete = true;

                        console.log("Real treasure found!");
                        console.log("Level 3 completed!");

                    } else {

                        console.log("Empty treasure chest!");
                        console.log("Find the other chest!");
                    }
                }
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


// Draw the treasure map hint image
export function drawMapHint(context) {

    // Do not draw if the hint is not active
    if (!showMapHint) {
        return;
    }

    // Hide the hint after 5 seconds
    if (Date.now() - mapHintStartTime >= mapHintDuration) {
        showMapHint = false;
        return;
    }

    // Select the correct hint image
    let hintImage;

    if (realChest === 0) {
        hintImage = leftHintImage;
    } else {
        hintImage = rightHintImage;
    }

    // Draw the hint in the centre of the game
    if (hintImage.complete && hintImage.naturalWidth > 0) {

        context.drawImage(
            hintImage,
            200,
            125,
            1000,
            650
        );
    }
}


// Check whether Level 3 is completed
export function isLevel3Complete() {
    return level3Complete;
}
