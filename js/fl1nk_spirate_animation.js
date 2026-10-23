/* ============== Import the spirate sheet and get each frame from there ==============*/ 

export let fl1nkAnimationData = { fl1nk_frames: [] };

//E Define the size of each frame in spirate sheet
let frameSize = 256;

// Loop over each row and column in spirate sheet, and get the postion, and dimentions
for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
        fl1nkAnimationData.fl1nk_frames.push({
            position: {
                x: column * frameSize,
                y: row * frameSize,
                width: frameSize,
                height: frameSize
            }
        });
    }
}