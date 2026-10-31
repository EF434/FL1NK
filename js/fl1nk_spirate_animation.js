/* ============== Import the spirate sheet and get each frame from there ==============*/ 

// store and export spirate animation frames
export let fl1nkAnimationData = { fl1nk_frames: [] };

// set size of each frame in spirate sheet
const frameWidth = 317;
const frameHeight = 310.25;

// Loop over to get position and size of all frames
for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
        fl1nkAnimationData.fl1nk_frames.push({
            position: {
                x: column * frameWidth,
                y: row * frameHeight,
                width: frameWidth,
                height: frameHeight
            }
        });
    }
}