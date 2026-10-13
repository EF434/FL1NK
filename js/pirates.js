"use strict";

// ---------- IMAGES ----------
// frames 1-4 = walking right, frames 5-8 = walking left
const pirateFrames = [];

for (let i = 1; i <= 8; i++) {
    const image = new Image();
    image.src = "assets/images/pirate-frames/pirate-frame-" + i + ".png";
    pirateFrames.push(image);
}

// ---------- PIRATE ----------
const pirate = {
    x: 219,
    y: 631,
    minX: 219,       // left end of the patrol
    maxX: 1115,      // right end of the patrol
    width: 75,
    height: 75,
    speed: 1.5,
    direction: 1,    // 1 = walking right, -1 = walking left
    frame: 0,        // which of the 4 walking pictures to show
    frameTimer: 0    // counts game frames
};

// ---------- UPDATE ----------
function updatePirate() {
    // walk
    pirate.x = pirate.x + pirate.speed * pirate.direction;

    // turn around at either end
    if (pirate.x >= pirate.maxX) {
        pirate.direction = -1;
    }

    if (pirate.x <= pirate.minX) {
        pirate.direction = 1;
    }

    // change to the next walking picture every 8 game frames
    pirate.frameTimer = pirate.frameTimer + 1;

    if (pirate.frameTimer >= 8) {
        pirate.frameTimer = 0;
        pirate.frame = pirate.frame + 1;

        if (pirate.frame === 4) {
            pirate.frame = 0;
        }
    }
}

// ---------- DRAW ----------
function drawPirate() {
    // use pictures 5-8 when walking left
    let index = pirate.frame;

    if (pirate.direction === -1) {
        index = pirate.frame + 4;
    }

    ctx.drawImage(
        pirateFrames[index],
        pirate.x,
        pirate.y - pirate.height / 2,
        pirate.width,
        pirate.height
    );
}