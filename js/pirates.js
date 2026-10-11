
"use strict";

const pirateFrames = [];

for (let i = 1; i <= 8; i++) {
    const image = new Image();
    image.src = `assets/images/pirate-frames/pirate-frame-${i}.png`;
    pirateFrames.push(image);
}

const pirate = {
    x: 219.06,
    y: 630.9,
    minX: 219.06,
    maxX: 1114.8,
    width: 75,
    height: 75,
    speed: 1.5,
    direction: 1,
    frame: 0,
    frameTimer: 0,
    deck: 3
};


function updatePirate() {
    pirate.x += pirate.speed * pirate.direction;

    // Turn around at the ends of the patrol route.
    if (pirate.x >= pirate.maxX) {
        pirate.x = pirate.maxX;
        pirate.direction = -1;
    }

    if (pirate.x <= pirate.minX) {
        pirate.x = pirate.minX;
        pirate.direction = 1;
    }

    // Change the walking frame.
    pirate.frameTimer++;

    if (pirate.frameTimer >= 8) {
        pirate.frameTimer = 0;
        pirate.frame = (pirate.frame + 1) % 4;
    }
}

function drawPirate(ctx) {
    const frameIndex = pirate.direction === 1
        ? pirate.frame
        : pirate.frame + 4;

    const image = pirateFrames[frameIndex];

    if (image.complete && image.naturalWidth > 0) {
        ctx.drawImage(
            image,
            pirate.x,
            pirate.y - pirate.height / 2,
            pirate.width,
            pirate.height
        );
    }
}
